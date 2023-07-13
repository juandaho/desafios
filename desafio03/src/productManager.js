import fs from "fs";

export class ProductManager {
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
