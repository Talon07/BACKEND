const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.ultId = 0;

    //Cargar los carritos almacenados en el archivo
    this.cargarCarritos();
  }

  async cargarCarritos() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
      if (this.carts.length > 0) {
        //Verifico si hay por lo menos un carrito creado:
        this.ultId = Math.max(...this.carts.map((cart) => cart.id));
        //Utilizo el metodo map para crear un array que solo tenga los identificadores del carrito y con math.max obtengo el mayor.
      }
    } catch (error) {
      console.error("Error al cargar los carritos desde el archivo", error);
      //si no existe el archivo, lo voy a crear.
      await this.guardarCarritos();
    }
  }

  async guardarCarritos() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async crearCarrito() {
    const nuevoCarrito = {
      id: ++this.ultId,
      products: [],
    };

    this.carts.push(nuevoCarrito);
    //Guardamos el array en el archivo.
    await this.guardarCarritos();
    return nuevoCarrito;
  }

  async getCarritoById(cartId) {
    try {
      const carrito = this.carts.find((c) => c.id === cartId);
      if (!carrito) {
        throw new Error(`No existe un carrito con el id ${cartId}`);
      }
      return carrito;
    } catch (error) {
      console.log("Error al obtener el carrito por ID", error);
      throw error;
    }
  }

  async addProductCart(cartId, productId, quantity = 1) {
    const carrito = await this.getCarritoById(cartId);
    const productExist = carrito.products.find((p) => p.product === productId);

    if (productExist) {
      productExist.quantity += quantity;
    } else {
      carrito.products.push({ product: productId, quantity });
    }

    await this.guardarCarritos();
    return carrito;
  }
}

module.exports = CartManager;
