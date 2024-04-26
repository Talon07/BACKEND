const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  // provider: {
  //   type: String,
  //   required: true,
  // },
  // accountId: {
  //   type: String,
  //   required: true,
  // },
  last_name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
