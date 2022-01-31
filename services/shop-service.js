const shopModel = require("../moduls/shop");

const fs = require("fs");
const path = require("path");

class ShopService {
  async getShopCard() {
    const shopCards = await shopModel.find();
    return shopCards;
  }
  async setShopCard(data) {
    const newCard = {
      name: data.name,
      price: +data.price,
      stats:[
        {
          name: "Сила",
          value: data.stats[0]
        },
        {
          name: "Красноречие",
          value: data.stats[1]
        },
        {
          name: "Мудрость",
          value: data.stats[2]
        },
        {
          name: "Лидерство",
          value: data.stats[3]
        },
      ],
      imgUrl: process.env.URL_SERVER + "/uploads/shop/" + data.fotoName
    };
    const card = await shopModel.create(newCard);
    return card;
  }

  

  async deleteCard(id) {
    const card = await shopModel.findByIdAndDelete(id);
    const nameFile = card.imgUrl.split("/").pop()
    console.log(nameFile);
    fs.unlink(__dirname + `/../shop/${nameFile}`, (err) => {})
    return ;
  }
}

module.exports = new ShopService();
