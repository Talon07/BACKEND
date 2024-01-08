//Primer desafio Clase 2. -BACKEND-

class ProductsManager {
  static ultimoId = 0;

  constructor() {
    this.products = [];
  }

  //Metodo agregar productos
  addProducts(title, description, price, img, code, stock) {
    //Validar que se agregaron todos los campos
    if (!title || !description || !price || !img || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    //Validamos que el codigo sea unico
    //some: Es igual al find pero este retorna un booleano.

    if (this.products.some((item) => item.code === code)) {
      console.log("El codigo debe ser unico e irrepetible!");
      return;
    }

    //Creamos un nuevo objeto:

    const newProduct = {
      id: ++ProductsManager.ultimoId, //Primero incrementamos su id y luego lo asignamos.
      title,
      description,
      price,
      img,
      code,
      stock,
    };

    //Agregamos al array:
    this.products.push(newProduct);
  }

  //Metodo para mostrar productos
  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    //Busco el producto por el id en el array:
    const product = this.products.find((item) => item.id === id);

    if (product) {
      console.log("Lo encontré!!: ", product);
    } else {
      console.log("NOT FOUND");
    }
  }
}

//Testing:

//1) Se creará una instancia de la clase “ProductManager”

const manager = new ProductsManager();

//2) Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

console.log(manager.getProducts());

//3) Se llamará al método “addProduct” con los campos:
// title: “producto prueba”
// description:”Este es un producto prueba”
// price:200,
// thumbnail:”Sin imagen”
// code:”abc123”,
// stock:25

manager.addProducts(
  "Producto prueba",
  "esto es un producto prueba",
  200,
  "sin imagen",
  "abc123",
  25
);

//4)El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

//5)Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

console.log(manager.getProducts());

//6)Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.

// manager.addProduct("Producto prueba", "esto es un producto prueba", 200, "sin imagen", "abc123");

manager.addProducts(
  "Manzana",
  "las de color rojo",
  200,
  "sin imagen",
  "abc124",
  25
);
manager.addProducts(
  "Banana",
  "la de color amarillo",
  200,
  "sin imagen",
  "abc125",
  25
);

console.log(manager.getProducts());

//7) Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo

console.log("Verificamos ");
manager.getProductsById(20);
