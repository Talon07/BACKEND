const ProductModel = require("../models/product.model");

class ProductManagerDb {
  async addProduct(product) {
    try {
      if (!this.checkNewProduct(product)) {
        throw "Producto invalido";
      }
      const productExists = await ProductModel.findOne({ code: product.code });
      if (productExists) {
        return "El codigo del producto ya existe";
      }
      const newProduct = new ProductModel({
        ...product,
        status: true,
        thumbnails: product.thumbnails || [],
      });
      newProduct.save();
      return newProduct;
    } catch (err) {
      console.log("Error al agregar un producto:", err);
      throw err;
    }
  }

  async getProducts(queryObject) {
    const limit = queryObject.limit;
    const page = queryObject.page;
    const sort = queryObject.sort;
    const query = queryObject.query;
    let products;
    try {
      let args = {
        limit: limit || 10,
        page: page || 1,
        lean: true,
      };
      if (sort) {
        args.sort = { price: sort };
      }
      if (query) {
        products = await ProductModel.paginate({ category: query }, args);
      } else {
        products = await ProductModel.paginate({}, args);
      }
      products.prevLink = this.handleQueryString(
        queryObject,
        products.prevPage
      );
      products.nextLink = this.handleQueryString(
        queryObject,
        products.nextPage
      );
      return products;
    } catch (err) {
      console.log("error:", err);
      throw err;
    }
  }

  handleQueryString(queryObject, value) {
    if (value) {
      const queryArr = Object.keys(queryObject).map((e) =>
        e == "page" ? `${e}=${value}` : `${e}=${queryObject[e]}`
      );
      console.log("queryString:", queryArr);
      if (!queryObject.page) {
        queryArr.push(`page=${value}`);
      }
      return "/api/products/view?" + queryArr.join("&");
    }
    return null;
  }

  async getProductsLean() {
    try {
      const products = await ProductModel.find().lean();
      return products;
    } catch (err) {
      throw err;
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id).lean();
      if (!product) {
        throw "Product not found";
      }
      console.log("Producto encontrado");
      return product;
    } catch (err) {
      console.log("Error al buscar producto:", err);
      throw err;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const newProduct = await ProductModel.findByIdAndUpdate(
        id,
        updatedProduct
      );
      if (!newProduct) {
        throw "Product to update not found";
      }
      console.log("Producto actualizado");
      return newProduct;
    } catch (err) {
      console.log("Error al actualizar producto:", err);
      throw err;
    }
  }

  async deleteProduct(id) {
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(id);
      if (!deleteProduct) {
        throw "Product to delete not found";
      }
      console.log("Producto eliminado");
    } catch (err) {
      console.log("Error al actualizar producto:", err);
      throw err;
    }
  }

  checkNewProduct(product) {
    const fields = [
      "title",
      "description",
      "price",
      "code",
      "stock",
      "category",
    ];
    if (
      fields.every((e) => {
        return !!product[e];
      })
    ) {
      return true;
    }
    return false;
  }
}

module.exports = ProductManagerDb;
