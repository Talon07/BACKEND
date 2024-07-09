const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartutil.js");
const EmailManager = require("../services/errors/email.js");
const emailManager = new EmailManager();
const TicketRepository = require("../repositories/ticket.repository.js");
const ticketRepository = new TicketRepository();

class CartController {
  async nuevoCarrito(req, res) {
    try {
      const nuevoCarrito = await cartRepository.crearCarrito();
      res.json(nuevoCarrito);
    } catch (error) {
      res.status(500).send("Error al crear el carrito");
    }
  }

  async obtenerProductosDeCarrito(req, res) {
    const carritoId = req.params.cid;
    try {
      const productos = await cartRepository.obtenerProductosDelCarrito(
        carritoId
      );
      res.json(productos);
    } catch (error) {
      res.status(500).send("Error al obtener los productos del carrito");
    }
  }

  async agregarProductoEnCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      await cartRepository.agregarProducto(cartId, productId, quantity);
      res.send("Producto Agregado");
    } catch (error) {
      res.status(500).send("Error al agregar un producto al carrito");
    }
  }

  async eliminarProductoDeCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
      const updatedCart = await cartRepository.eliminarProductoDeCarrito(
        cartId,
        productId
      );
      const user = await UserModel.findOne({ cart: cartId });

      if (user && user.isPremium) {
        await EmailManager.enviarCorreoProductoEliminado(user.email, productId);
      }

      res.json({
        status: "success",
        message: "Producto eliminado del carrito correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async actualizarProductosEnCarrito(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
      const carrito = await cartRepository.actualizarProductosEnCarrito(
        cartId,
        updatedProducts
      );
      res.json({
        status: "success",
        message: "Carrito actualizado",
        carrito,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al actualizar productos del carrito");
    }
  }

  async actualizarCantidades(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
      const carrito = await cartRepository.actualizarCantidadesEnCarrito(
        cartId,
        productId,
        newQuantity
      );
      res.json({
        status: "success",
        message: "Carrito actualizado en sus cantidades",
        carrito,
      });
    } catch (error) {
      res.status(500).send("Error al actualizar las cantidades del carrito");
    }
  }

  async vaciarCarrito(req, res) {
    const cartId = req.params.cid;
    try {
      const carrito = await cartRepository.vaciarCarrito(cartId);
      res.json({
        status: "success",
        message: "Todos los productos del carrito fueron eliminados",
        carrito,
      });
    } catch (error) {
      res.status(500).send("Error al vaciar carrito");
    }
  }

  //Ultima Pre Entrega:
  async finalizarCompra(req, res) {
    const cartId = req.params.cid;
    try {
      // Obtener el carrito y sus productos
      const cart = await cartRepository.obtenerProductosDelCarrito(cartId);
      const products = cart.products;

      // Inicializar un arreglo para almacenar los productos no disponibles
      const productosNoDisponibles = [];

      // Verificar el stock y actualizar los productos disponibles
      for (const item of products) {
        const productId = item.product;
        const product = await productRepository.obtenerProductoPorId(productId);
        if (product.stock >= item.quantity) {
          // Si hay suficiente stock, restar la cantidad del producto
          product.stock -= item.quantity;
          await product.save();
        } else {
          // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
          productosNoDisponibles.push(productId);
        }
      }

      const userWithCart = await UserModel.findOne({ cart: cartId });

      const ticket = new TicketModel({
        code: Math.random().toString(36).substring(2, 15), // Generar código único
        purchase_datetime: new Date(),
        amount: products.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
        purchaser: userWithCart._id,
      });
      await ticket.save();

      cart.products = cart.products.filter((item) =>
        productosNoDisponibles.some((productId) =>
          productId.equals(item.product)
        )
      );
      await cart.save();

      await emailManager.enviarCorreoCompra(
        userWithCart.email,
        userWithCart.first_name,
        ticket._id
      );

      res.render("checkout", {
        cliente: userWithCart.first_name,
        email: userWithCart.email,
        numTicket: ticket._id,
      });
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = CartController;
