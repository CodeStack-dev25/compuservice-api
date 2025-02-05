import { connect } from "mongoose";
import { appLogger } from "./loggers.config.js";

export default class MongoSingleton {
  static #instance;

  constructor() {
    this.#connectMongoDB();
  }
  static getInstance() {
    if (this.#instance) {
      appLogger.info("Devolver la conexión MongoDB existente");
    } else {
      this.#instance = new MongoSingleton();
    }
    return this.#instance;
  }

  #connectMongoDB = async () => {
    try {
      await connect(process.env.DBURL);
      appLogger.info("Conectando a MongoDB");
    } catch (err) {
      appLogger.error("Error al intentar conectar a MongoDB", err);
      process.exit();
    }
  };
}
