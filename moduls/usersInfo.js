const { model, Schema } = require("mongoose");
module.exports = model(
  "usersInfo",
  new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    "last-name": {
      type: String,
      required: true,
    },
    "first-name": {
      type: String,
      required: true,
    },
    "midl-name": {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    group: {
      type: String,
      required: true,
    },
    cours: {
      type: String,
      required: true,
    },
    stats: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          deafult: "0",
        },
        icon: {
          type: String,
          required: true,
        },
      },
    ],
    money: {
      type: Number,
      default: 0,
    },
    imgUrl: {
      type: String,
      default: "",
    },
  })
);
