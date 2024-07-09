const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const nodemailer = require("nodemailer");

// Credenciales para nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class ProductController {
  async addProduct(req, res) {
    const nuevoProducto = req.body;
    try {
      const resultado = await productRepository.agregarProducto(nuevoProducto);
      res.json(resultado);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;
    try {
      // Buscar el producto antes de eliminarlo para obtener el dueño del producto
      const producto = await productRepository.obtenerProductoPorId(id);

      if (!producto) {
        return res.status(404).send("Producto no encontrado");
      }

      let respuesta = await productRepository.eliminarProducto(id);

      // Verificar si es premium y enviar correo
      if (producto.owner && producto.owner.role === "premium") {
        const mailOptions = {
          from: "ignaciotalon07@gmail.com",
          to: producto.owner.email,
          subject: "Producto Eliminado",
          text: `Hola ${producto.owner.nombre}, tu producto "${producto.nombre}" ha sido eliminado.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error al enviar el correo:", error);
          } else {
            console.log("Correo enviado: " + info.response);
          }
        });
      }

      res.json(respuesta);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).send("Error al eliminar el producto");
    }
  }

  async getProducts(req, res) {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;

      const productos = await productRepository.obtenerProductos(
        parseInt(limit),
        parseInt(page),
        sort,
        query
      );

      res.json(productos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).send("Error al obtener productos");
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;
    try {
      const buscado = await productRepository.obtenerProductoPorId(id);
      if (!buscado) {
        return res.status(404).json({
          error: "Producto no encontrado",
        });
      }
      res.json(buscado);
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      res.status(500).send("Error al obtener producto por ID");
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const productoActualizado = req.body;

      const resultado = await productRepository.actualizarProducto(
        id,
        productoActualizado
      );
      res.json(resultado);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(500).send("Error al actualizar el producto");
    }
  }
}

module.exports = ProductController;
