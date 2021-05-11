const cards = document.getElementById("cards");
const item = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let cart = {};

document.addEventListener("DOMContentLoaded", () => {
  get();
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    printCart();
  }
});

cards.addEventListener("click", (e) => {
  addCart(e);
});

item.addEventListener("click", (e) => {
  btnAccion(e);
});
const get = async () => {
  try {
    const req = await fetch("../../api.json");
    const res = await req.json();
    //console.log(res);
    printCard(res);
  } catch (e) {
    console.log(e);
  }
};

const printCard = (data) => {
  data.forEach((item) => {
    templateCard.querySelector("h5").textContent = item.title;
    templateCard.querySelector("p").textContent = item.precio;
    templateCard.querySelector("img").setAttribute("src", item.thumbnailUrl);
    templateCard.querySelector(".btn-dark").dataset.id = item.id;

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCart = (e) => {
  //console.log(e.target);
  //console.log(e.target.classList.contains("btn"));
  if (e.target.classList.contains("btn")) {
    setCart(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCart = (x) => {
  //console.log(x);
  const producto = {
    id: x.querySelector(".btn").dataset.id,
    title: x.querySelector("h5").textContent,
    precio: x.querySelector("p").textContent,
    cantidad: 1,
  };

  if (cart.hasOwnProperty(producto.id)) {
    producto.cantidad = cart[producto.id].cantidad + 1;
  }

  cart[producto.id] = { ...producto };
  printCart();
};

const printCart = () => {
  // console.log(cart);
  item.innerHTML = "";
  Object.values(cart).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  item.appendChild(fragment);
  localStorage.setItem("cart", JSON.stringify(cart));
  printFooter();
};

const printFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(cart).length == 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience acomprar!</th>`;
    return;
  }

  const nCantidad = Object.values(cart).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(cart).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );
  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);

  footer.appendChild(fragment);

  const btnVaciar = document.getElementById("vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    cart = {};
    printCart();
  });
};
function btnAccion(e) {
  console.log(e.target);
  //Aumentar
  if (e.target.classList.contains("btn-info")) {
    const producto = cart[e.target.dataset.id];
    producto.cantidad++;
    cart[e.target.dataset.id] = { ...producto };
    console.log(producto);
  }
  if (e.target.classList.contains("btn-danger")) {
    const producto = cart[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad == 0) {
      delete cart[e.target.dataset.id];
    }
  }

  printCart();
}
