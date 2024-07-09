const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const MessageModel = require("../models/message.model.js");

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", async (socket) => {
      console.log("Un cliente se conectó");

      socket.emit("productos", await productRepository.obtenerProductos());

      socket.on("eliminarProducto", async (id) => {
        await productRepository.eliminarProducto(id);
        this.emitUpdatedProducts();
      });

      socket.on("agregarProducto", async (producto) => {
        await productRepository.agregarProducto(producto);
        this.emitUpdatedProducts();
      });

      socket.on("message", async (data) => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        socket.emit("message", messages);
      });
    });
  }

  async emitUpdatedProducts() {
    this.io.emit("productos", await productRepository.obtenerProductos());
  }
}

module.exports = SocketManager;
