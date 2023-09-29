import mongoose from "mongoose";
import config from "../config/config.js";

export default class MongoDbConnection {
  static #instance;

  constructor() {
    mongoose
      .connect(config.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Base de datos conectada");
      })
      .catch((error) => {
        console.log("Error al conectar a la base de datos:", error);
      });
  }

  static getConnection() {
    try {
      if (this.#instance) {
        console.log(`Ya existe la conexión`);
        return this.#instance;
      }
      this.#instance = new MongoDbConnection();
    } catch (error) {
      console.log("Error al obtener la conexión:", error.message);
    }
  }
}
