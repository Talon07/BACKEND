const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [
    {
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;
