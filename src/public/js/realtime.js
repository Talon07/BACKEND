const socket = io(); // Verifica que la URL del servidor sea correcta si es necesario.

const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

socket.on("productos", (data) => {
  renderProductos(data);
});

//Función para renderizar nuestros productos:
const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  productos.docs.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = ` 
                        <p> ${item.title} </p>
                        <p> ${item.price} </p>
                        <button> Eliminar </button>
                        `;

    contenedorProductos.appendChild(card);
    card.querySelector("button").addEventListener("click", () => {
      if (role === "premium" && item.owner === email) {
        eliminarProducto(item._id);
      } else if (role === "admin") {
        eliminarProducto(item._id);
      } else {
        Swal.fire({
          title: "Error",
          text: "No tenes permiso para borrar ese producto",
        });
      }
    });
  });
};

const eliminarProducto = (id) => {
  socket.emit("eliminarProducto", id);
};

//Agregamos productos del formulario:
document.getElementById("btnEnviar").addEventListener("click", () => {
  agregarProducto();
});

const agregarProducto = () => {
  const role = document.getElementById("role").textContent;
  const email = document.getElementById("email").textContent;

  const owner = role === "premium" ? email : "admin";

  const producto = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value), // Asegúrate de convertir el precio a número
    img: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: parseInt(document.getElementById("stock").value), // Asegúrate de convertir el stock a número
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
    owner,
  };

  // Verifica que todos los campos obligatorios estén llenos
  if (
    !producto.title ||
    !producto.description ||
    !producto.price ||
    !producto.code ||
    !producto.stock ||
    !producto.category
  ) {
    Swal.fire({
      title: "Error",
      text: "Por favor completa todos los campos obligatorios.",
    });
    return;
  }

  socket.emit("agregarProducto", producto);
  Swal.fire({
    title: "Producto agregado",
    text: "El producto ha sido agregado exitosamente.",
    icon: "success",
  });
};
