const Router = require("express").Router;
const userController = require("../control/user-controller");
const shopController = require("../control/shop-controller");
const router = Router();

//====Работа с авторизацией====
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:id", userController.activate);
router.get("/refresh", userController.refresh);

//====Получение пользователей====
router.get("/users", userController.getUsers);
router.get("/user/:id", userController.getUserInfo);
router.get("/noactivationuser", userController.getNoActivationUsers);
router.get("/users/characteristic/:page", userController.getUsersCharacteristic)
router.post("/users/add/characteristic/:id", userController.addCharacteristic)

//====Работа с карточками магазина====
router.get("/shop", shopController.getShopCards);
router.post("/shop", shopController.setShopCard);
router.delete("/shop/:id", shopController.removeShopCard);

//====Загрузка файлов====
router.post("/uploadAvar/:id", userController.saveUserAvater);

module.exports = router;
