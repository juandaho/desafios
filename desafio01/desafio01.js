class productManager {
  constructor() {
    this.productos = [];
  }

  // Obtener todos los productos
  getProduct() {
    return this.productos;
  }

  // Generador de ID para nuevos productos
  idGenerator() {
    const idValue = this.productos.length;
    if (idValue == 0) {
      return 1;
    } else {
      return this.productos[idValue - 1].id + 1;
    }
  }

  // Agregar un nuevo producto
  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Ingrese todos los datos del producto");
      return;
    } else {
      const id = this.idGenerator();

      // Verificar si el producto con el mismo código ya existe
      const productoBuscado = this.productos.find(
        (element) => element.code == code
      );

      if (!productoBuscado) {
        const productoNuevo = {
          id: id,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        return this.productos.push(productoNuevo);
      } else {
        console.log("El código del producto ya existe");
      }
    }
  }

  // Obtener un producto por su ID
  getProductById(id) {
    const productoEncontrado = this.productos.find(
      (element) => element.id == id
    );

    if (!productoEncontrado) {
      console.log("NOT FOUND :(");
      return;
    } else {
      return productoEncontrado;
    }
  }
}

// Crear una instancia de productManager
const productoManager = new productManager();

// Agregar productos
productoManager.addProduct("PC", "Core i3", 1200, "www.imagen.com", 123, 10);
productoManager.addProduct("PC", "Core i3", 1200, "www.imagen.com", 123, 10);
productoManager.addProduct("Laptop", "Core i7", 1800, "www.imagen.com", 456, 5);
productoManager.addProduct("Smartphone", "Snapdragon 865", 900, "www.imagen.com", 789, 20);
productoManager.addProduct("Tablet", "Apple A12 Bionic", 700, "www.imagen.com", 101112, 8);
productoManager.addProduct("Smart TV", "55 pulgadas", 1500, "www.imagen.com", 131415, 15);
productoManager.addProduct("Refrigerador", "Capacidad 300L", 1000, "www.imagen.com", 161718, 12);
productoManager.addProduct("Cámara", "Sensor de 20MP", 800, "www.imagen.com", 192021, 7);
productoManager.addProduct("Altavoz Bluetooth", "Potencia 20W", 100, "www.imagen.com", 222324, 30);
productoManager.addProduct("Impresora", "Inyección de tinta", 200, "www.imagen.com", 252627, 3);

console.log("Estos son los Productos Listados")
console.log(productoManager.getProduct());

console.log("------------------------")

console.log("Productos buscados")

console.log(productoManager.getProductById(3));
console.log(productoManager.getProductById(10));
