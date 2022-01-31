const { model, Schema } = require("mongoose");
const shop = new Schema({
  name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    default: "",
  },
  stats: [
    {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        deafult: 0,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
});

module.exports = model("shop", shop);
