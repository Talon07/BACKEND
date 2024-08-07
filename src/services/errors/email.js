const nodemailer = require("nodemailer");

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async eliminarProductoDeCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
      // Obtener el carrito y el producto
      const carrito = await cartRepository.obtenerProductosDelCarrito(cartId);
      const producto = carrito.products.find(
        (p) => p.product._id.toString() === productId
      );

      // Eliminar el producto del carrito
      if (producto) {
        await cartRepository.eliminarProducto(cartId, productId);

        // Verificar si el producto pertenece a un usuario premium
        if (producto.product.userType === "premium") {
          // Configurar el transporte de nodemailer
          const transporter = nodemailer.createTransport({
            service: "Gmail", // o el servicio de correo que estés utilizando
            auth: {
              user: "tu-correo@gmail.com",
              pass: "tu-contraseña",
            },
          });

          // Configurar el correo electrónico
          const mailOptions = {
            from: "tu-correo@gmail.com",
            to: "correo-del-usuario-premium@example.com",
            subject: "Producto Eliminado del Carrito",
            text: `El producto ${producto.product.title} ha sido eliminado del carrito.`,
          };

          // Enviar el correo electrónico
          await transporter.sendMail(mailOptions);
        }

        res.json({
          status: "success",
          message: "Producto eliminado del carrito correctamente",
        });
      } else {
        res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async enviarCorreoCompra(email, first_name, ticket) {
    try {
      const mailOptions = {
        from: "Coder Test <ignaciotalon07@gmail.com>",
        to: email,
        subject: "Confirmación de compra",
        html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }
  }

  async enviarCorreoRestablecimiento(email, first_name, token) {
    try {
      const mailOptions = {
        from: "coderhouse50015@gmail.com",
        to: email,
        subject: "Restablecimiento de Contraseña",
        html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:8080/password">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar correo electrónico:", error);
      throw new Error("Error al enviar correo electrónico");
    }
  }
}

module.exports = EmailManager;
