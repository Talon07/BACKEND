async function eliminarProductoDeCarrito(cartId, productId) {
  console.log(
    `Intentando eliminar producto ${productId} del carrito ${cartId}`
  );

  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el producto del carrito");
    }

    // Eliminar el producto del DOM
    const cartItemElement = document.querySelector(`#product-${productId}`);
    if (cartItemElement) {
      cartItemElement.remove();
    } else {
      console.warn("No se encontró el elemento del producto en el DOM");
    }

    // Actualizar el total del carrito
    actualizarTotalCarrito();

    // Notificar al usuario (opcional)
    alert("Producto eliminado del carrito");
  } catch (error) {
    console.error("Error:", error);
  }
}

function actualizarTotalCarrito() {
  const totalCarritoElement = document.getElementById("total-compra");
  if (totalCarritoElement) {
    // Recalcular el total del carrito (lógica específica para tu caso)
    const nuevoTotal = calcularTotalCarrito(); // Función para calcular el total

    // Actualizar el elemento HTML del total
    totalCarritoElement.textContent = `Total de la compra: $${nuevoTotal}`;
  } else {
    console.warn("No se encontró el elemento del total del carrito en el DOM");
  }
}

function calcularTotalCarrito() {
  let total = 0;
  const productPrices = document.querySelectorAll(".product-total-price");
  productPrices.forEach((priceElement) => {
    total += parseFloat(priceElement.textContent.replace("$", ""));
  });
  return total.toFixed(2); // Devuelve el total con 2 decimales
}

async function vaciarCarrito(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Error al vaciar el carrito");
    }
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

// Funciones adicionales como increaseQuantity y decreaseQuantity pueden ser agregadas aquí si son necesarias
