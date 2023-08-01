const socketClient = io();

socketClient.on("envio_productos", updateProductList);

/**
 * Actualiza la lista de productos en la página.
 * @param {Array} products - Lista de productos.
 */
function updateProductList(products) {
  let div = document.getElementById("list-products");
  let productos = products
    .map((product) => createProductHTML(product))
    .join("");
  div.innerHTML = productos;
}

/**
 * Crea el HTML
 * @param {Object} product - Datos del producto.
 * @returns {string} HTML del producto.
 */
function createProductHTML(product) {
  return `
        <article class="container">
            <div class="card">
                <div class="imgBx">
                    <img src="${product.thumbnail}" width="150" />
                </div>
                <div class="contentBx">
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <p>Code: ${product.code}</p>
                    <p>Stock: ${product.stock}</p>
                    <div class="price">
                        <h3>$${product.price}</h3>
                    </div>
                    <a href="#">Buy Now</a>
                </div>
            </div>
        </article>`;
}

let form = document.getElementById("formProduct");
form.addEventListener("submit", handleFormSubmission);

/**
 
 * @param {Event} evt - Evento de presentación del formulario.
 */

function handleFormSubmission(evt) {
  evt.preventDefault();

  let productData = {
    title: form.elements.title.value,
    description: form.elements.description.value,
    price: parseFloat(form.elements.price.value),
    thumbnail: form.elements.thumbnail.value,
    code: form.elements.code.value,
    stock: parseInt(form.elements.stock.value),
    status: true,
  };

  if (form.elements.category) {
    productData.category = form.elements.category.value;
  }

  socketClient.emit("addProduct", productData);
  form.reset();
}

document
  .getElementById("delete-btn")
  .addEventListener("click", handleProductDeletion);

function handleProductDeletion() {
  const deleteidinput = document.getElementById("id-prod");
  const deleteid = parseInt(deleteidinput.value);
  socketClient.emit("deleteProduct", deleteid);
  deleteidinput.value = "";
}
