const { model, Schema } = require("mongoose");
const users = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  refreshToken: { type: String, required: true},
});

module.exports = model("UserToken", users);
