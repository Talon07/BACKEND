const express = require("express");
const router = express.Router();
const CartManagerDb = require("../controllers/cart-manager-db.js");
const cartManagerDb = new CartManagerDb();

router.use(express.static("./src/public"));

router.get("/view", async (req, res) => {
  try {
    const newCart = await cartManagerDb.getCartById("65dabc56bf0e38b152737f40");
    res.render("cart", {
      cart: JSON.stringify(newCart),
      active: { cart: true },
    });
  } catch (err) {
    console.log("err:", err);
    res.status(500).json({ message: "Server problems" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManagerDb.createCart();
    res.json({ message: `Cart created with id ${newCart._id}` });
  } catch (err) {
    res.status(500).json({ message: "Server problems" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManagerDb.getCartById(cid);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: `Cart with id ${cid} not found` });
    }
  } catch (err) {
    res.status(500).json({ message: "Server problems" });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const quantity = req.body.quantity;
    const { cid, pid } = req.params;
    if (cid && pid) {
      const status = await cartManagerDb.addToCart(cid, pid, quantity);
      res.status(200).json({ messsage: status });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (cid && pid) {
      const status = await cartManagerDb.deleteFromCart(cid, pid);
      res.status(200).json({ messsage: status });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete("/:cid/", async (req, res) => {
  try {
    const { cid } = req.params;
    if (cid) {
      const status = await cartManagerDb.deleteAllProductsFromCart(cid);
      res.status(200).json({ messsage: status });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (cid) {
      const products = req.body;
      const status = await cartManagerDb.addProductsToCart(cid, products);
      res.status(200).json({ messsage: status });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
