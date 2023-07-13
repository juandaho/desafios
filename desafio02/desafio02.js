const fs = require("fs");

class productManager {
  constructor(path) {
    // Inicializar la ruta del archivo de productos
    this.path = path;
    // Inicializar la lista de productos
    this.productos = [];
  }

  // Cargar productos desde el archivo de productos
  async getProduct() {
    const produtosLista = await fs.promises.readFile(this.path, "utf-8");
    const productosListaJSON = JSON.parse(produtosLista);
    this.productos = productosListaJSON;
    return productosListaJSON;
  }

  // Generar un nuevo ID para un producto
  async idGenerator() {
    const contador = this.productos.length;
    if (contador === 0) {
      return 1;
    } else {
      return this.productos[contador - 1].id + 1;
    }
  }

  // Añadir un producto a la lista y guardar en el archivo
  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Ingrese los datos del producto");
      return;
    } else {
      const codigo = this.productos.find((elemento) => elemento.code === code);
      if (codigo) {
        console.log("El codigo esta repetido");
        return;
      } else {
        const idgenerado = await this.idGenerator();
        const productoAgregado = {
          id: idgenerado,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        this.productos.push(productoAgregado);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.productos, null, 2)
        );
      }
    }
  }

  // Actualizar un producto y guardar los cambios en el archivo
  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    if (
      !id ||
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock
    ) {
      console.log("Ingrese los datos del producto para su actualización");
      return;
    } else {
      const productosActuales = await this.getProduct();
      const nuevosProductosActuales = productosActuales.map((elemento) => {
        if (elemento.id === id) {
          return {
            ...elemento,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
          };
        } else {
          return elemento;
        }
      });
      this.productos = nuevosProductosActuales;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(nuevosProductosActuales, null, 2)
      );
    }
  }

  // Buscar un producto por ID
  async getProductById(id) {
    const productosCompletos = await this.getProduct();
    const encontrado = productosCompletos.find((element) => element.id === id);
    return encontrado;
  }

  // Eliminar un producto por ID y guardar los cambios en el archivo
  async deleteProduct(id) {
    const productosCompletos = await this.getProduct();
    const productosActualizados = productosCompletos.filter(
      (elemento) => elemento.id !== id
    );
    this.productos = productosActualizados;
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productosActualizados, null, 2)
    );
  }
}

// Función para probar la clase productManager
async function generator() {
  const productoManager = new productManager("./files/productos.json");

  //Elementos que se encuentran ya en el archivo JSON
  await productoManager.addProduct(
    "Keyboard",
    "Logitech ABC",
    2500,
    "www.imagen2.com",
    "keyboard01",
    150
  );
  await productoManager.addProduct(
    "Monitor",
    "Samsung DEF",
    10000,
    "www.imagen3.com",
    "monitor01",
    50
  );
  await productoManager.addProduct(
    "Headset",
    "Sony GHI",
    5000,
    "www.imagen4.com",
    "headset01",
    80
  );
  await productoManager.addProduct(
    "Webcam",
    "HP JKL",
    3000,
    "www.imagen5.com",
    "webcam01",
    120
  );
  await productoManager.addProduct(
    "Printer",
    "Epson MNO",
    8000,
    "www.imagen6.com",
    "printer01",
    60
  );

  // await productoManager.updateProduct(1,"Laptop", "Dell Inspiron", 15000, "www.imagen7.com", "laptop01", 45 );
  // await productoManager.updateProduct(3,"Tablet", "Apple iPad", 12000, "www.imagen8.com", "tablet01", 70);
  // await productoManager.deleteProduct(1);

  //const ejemplo = await productoManager.getProductById(2);

  const listado = await productoManager.getProduct();
  console.log(listado);
}

generator();
