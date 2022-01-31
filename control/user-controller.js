const userService = require("../services/user-service");
const userInfoService = require("../services/user-info-service");

const fs = require("fs");
const path = require("path");

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, userInfo } = req.body;
      const userData = await userService.registration(
        email,
        password,
        userInfo
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      res.json(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }
  async activate(req, res, next) {
    try {
      const activationId = req.params.id;
      await userService.activate(activationId);
      return res.status(200).json({ message: "Пользователь активирован" });
    } catch (error) {
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async getUsers(req, res, next) {
    try {
      const allUsers = await userService.getAllUser();
      res.status(200).json(allUsers);
    } catch (error) {
      next(error);
    }
  }

  async getNoActivationUsers(req, res, next) {
    try {
      const noActivUsers = await userService.getNoActovationUsers();
      console.log(noActivUsers);
      res.status(200).json(noActivUsers);
    } catch (error) {
      console.log(error);
    }
  }

  async getUserInfo(req, res, next) {
    try {
      const userId = req.params.id;
      const UserInfo = await userInfoService.getUserInfo(userId);
      return res.status(200).json(UserInfo);
    } catch (error) {
      // next(error);
      return res
        .status(200)
        .json({ message: "Пользователя с таким id не существует" });
    }
  }

  async saveUserAvater(req, res, next) {
    try {
      const user = await userInfoService.getUserInfo(req.params.id);
      const type = req.files.file.name.split(".");
      if (user.imgUrl) {
        const nameAvatar =
          user.imgUrl.split("/")[user.imgUrl.split("/").length - 1];
        fs.unlink(__dirname + `/../uploads/${nameAvatar}`, (err) => {});
      }
      user.imgUrl =
        process.env.URL_SERVER +
        "/uploads/" +
        req.params.id +
        "." +
        type[type.length - 1];
      await user.save();
      const tempPath = req.files.file.path;
      const targetPath = path.join(
        __dirname,
        "../uploads/" + req.params.id + "." + type[type.length - 1]
      );
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);

        res.status(200).contentType("text/plain").end("File uploaded!");
      });
    } catch (error) {
      next(error);
    }
  }
  async getUsersCharacteristic(req, res, next) {
    try {
      const usersInfo = await userService.getUsersFromTableCharacteristic(
        req.params.page
      );
      res.status(200).json(usersInfo);
    } catch (error) {
      next(error);
    }
  }
  async addCharacteristic(req, res, next) {
    try {
      const id = req.params.id;
      const stats = req.body;
      const user = await userInfoService.addCharacteristic(id, stats);
      res.status(200).json({
        message: "Характеристики выданы",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
