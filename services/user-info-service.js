const UserInfoModel = require("../moduls/usersInfo.js");
const UserForActivationDto = require("../dtos/user-for-activation-dto");

class UserInfoService {
  async setUserInfo(userId, info) {
    const userData = await UserInfoModel.create({
      user: userId,
      "last-name": info.last,
      "first-name": info.first,
      "midl-name": info.midl,
      faculty: info.faculty,
      group: info.group,
      cours: info.cours,
      stats: [
        {
          name: "Cила",
          value: "0",
          icon: "strength-icon.svg",
        },
        {
          name: "Красноречие",
          value: "0",
          icon: "oratory-icon.svg",
        },
        {
          name: "Мудрость",
          value: "0",
          icon: "intellect-icon.svg",
        },
        {
          name: "Лидерство",
          value: "0",
          icon: "leadership-icon.svg",
        },
      ],
    });
    return userData;
  }

  async getUserInfo(id) {
    const userInfo = await UserInfoModel.findOne({ user: id });
    if (userInfo) return userInfo;
    else return { error: "Пользователя не существует" };
  }

  async getActivationUsersInfo(users){
    const usersInfo = [];
    for (let i = 0; i < users.length; i++) {
      const user = await UserInfoModel.findOne({ user: users[i]._id });
      usersInfo.push(user)
    }
    return usersInfo
  }

  async getNoActivationUsersInfo(users) {
    const usersInfo = [];
    for (let i = 0; i < users.length; i++) {
      const user = await UserInfoModel.findOne({ user: users[i]._id });
      usersInfo.push(new UserForActivationDto(user));
    }
    return usersInfo;
  }

  async addCharacteristic(id, stats) {
    const userInfo = await UserInfoModel.findOne({ user: id });
    userInfo.stats[0].value = +userInfo.stats[0].value + +stats.strength;
    userInfo.stats[1].value = +userInfo.stats[1].value + +stats.eloquence;
    userInfo.stats[2].value = +userInfo.stats[2].value + +stats.wisdom;
    userInfo.stats[3].value = +userInfo.stats[3].value + +stats.leadership;
    userInfo.money = userInfo.money + +stats.money;
    await userInfo.save();
    return userInfo;
  }
}

module.exports = new UserInfoService();
