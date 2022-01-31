const shopService = require("../services/shop-service");
const fs = require("fs");
const path = require("path");
class ShopController {
  async getShopCards(req, res, next) {
    try {
      const cards = await shopService.getShopCard();
      return res.status(200).json(cards);
    } catch (error) {
      next(error);
    }
  }
  async setShopCard(req, res, next) {
    try {
      const foto = req.files.file;
      const fotoName = foto.path.split("\\").pop();
      const stats = req.body.stats.split(",");
      const cardModel = await shopService.setShopCard({
        name: req.body.name,
        price: req.body.price,
        fotoName,
        stats,
      });
      const tempPath = req.files.file.path;
      const targetPath = path.join(__dirname, "../shop/" + fotoName);
      console.log(targetPath);
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);

        res.status(200).contentType("text/plain").end("File uploaded!");
      });
    } catch (error) {
      next(error);
    }
  }
  async removeShopCard(req, res, next) {
    try {
      const id = req.params.id;
      const card = await shopService.deleteCard(id);
      return res
        .status(200)
        .json({ message: "Предмет удален из магазина" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShopController();
