const UserModel = require("../moduls/users.js");
const UserInfoModel = require("../moduls/usersInfo");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const MailService = require("./mail-service");
const TokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const UsersInfoDto = require("../dtos/users-info-dto");
const UsersInfoTableDto = require("../dtos/user-info-from-table-dto");
const ApiError = require("../exiptions/api-error");
const tokenService = require("./token-service");
const UserInfoService = require("./user-info-service");
const userInfoService = require("./user-info-service");

class UserService {
  async registration(email, password, userInfo) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadReqest(
        `пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    await MailService.sendAcrivationMail(
      email
    );
    const adminId = await UserInfoModel.find({role: "admin"})
    console.log(adminId);
    for (let i = 0; i < adminId.length; i++) {
      const admin = await UserModel.findById(adminId[i].user)
      await MailService.sendAdminMail(admin.email)      
    }
    const userDto = new UserDto(user);
    const tokens = TokenService.generationToken({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    const userInf = await UserInfoService.setUserInfo(userDto.id, userInfo);
    return {
      ...tokens,
      user: userDto,
      userInfo:{
        id : userInfo._id,
        role: userInfo.role,
        imgUrl: userInfo.imgUrl,
        "first-name": userInfo["first-name"]
      },
      userInf
    };
  }

  async activate(activationId) {
    const user = await UserModel.findOne({ _id: activationId });
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadReqest("Пользователь с таким email был не найден");
    }
    const isPassEquals = bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadReqest("Неверный пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generationToken({ ...userDto });
    const userInfo = await userInfoService.getUserInfo(userDto.id)
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
      userInfo:{
        id : userInfo._id,
        role: userInfo.role,
        imgUrl: userInfo.imgUrl,
        "first-name": userInfo["first-name"]
      },
    };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromBd = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromBd) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userInfo = await UserInfoModel.findOne({ user: userData.id });
    const userDto = new UserDto(user);
    const tokens = tokenService.generationToken({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
      userInfo:{
        id : userInfo._id,
        role: userInfo.role,
        imgUrl: userInfo.imgUrl,
        "first-name": userInfo["first-name"]
      },
    };
  }
  async getAllUser() {
    const users = await UserModel.find({ isActivated: true });
    const ActivUsersInfo = await UserInfoService.getActivationUsersInfo(users);
    return ActivUsersInfo.map((item) => {
      return new UsersInfoDto(item);
    });
  }
  async getNoActovationUsers() {
    const noActivUsers = await UserModel.find({ isActivated: false });
    const noActivUsersInfo = await UserInfoService.getNoActivationUsersInfo(noActivUsers);
    // return noActivUsersInfo;
    return noActivUsersInfo
  }

  async getUsersFromTableCharacteristic(page){
    const users = await UserModel.find({isActivated: true}).limit(10).skip(10 * (page - 1) )
    const countUsers = await UserModel.estimatedDocumentCount()
    const usersInfo = []
    for (let index = 0; index < users.length; index++) {
      const info = await UserInfoService.getUserInfo(users[index]._id)
      usersInfo.push(info)
    }
    for (let index = 0; index < usersInfo.length; index++) {
      usersInfo[index] = new UsersInfoTableDto(usersInfo[index])
    }
    return {
      maxPage: Math.ceil(1/10),
      usersInfo
    }
  }
}

module.exports = new UserService();
