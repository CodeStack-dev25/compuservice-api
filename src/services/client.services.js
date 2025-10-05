import { appLogger } from "../config/loggers.config.js";
import clientsSchema from "../models/clients.models.js";
import brandSchema from "../models/brand.models.js";
import fs from "fs";

export const newClient = async (client) => {
  try {
    return await clientsSchema.insertMany(client);
  } catch (error) {
    appLogger.error("Error al crear cliente ", error);
  }
};

export const getAllClients = async () => {
  try {
    return await clientsSchema.find();
  } catch (error) {
    appLogger.error("Erroral obtener clientes: ", error);
  }
};

export const getClientByCode = async (code) => {
  try {
    return await clientsSchema.findById(code);
  } catch (error) {
    appLogger.error("Error al obtener el cliente: ", error);
  }
};

export const getClientById = async (id) => {
  try {
    const client = await clientsSchema.findById(id);
    return client;
  } catch (error) {
    appLogger.error("Error al obtener el cliente:", error);
  }
};

export const upClient = async (id, client) => {
  try {
    return await clientsSchema.findByIdAndUpdate(id, client, { new: true });
  } catch (error) {
    appLogger.error("Error al actualizar el cliente: ", error);
  }
};

export const deleteClient = async (cid) => {
  try {
    return await clientsSchema.findByIdAndDelete(cid);
  } catch (error) {
    appLogger.error("Error al eliminar el cliente: ", error);
  }
};

export const deleteLocalFiles = async (files) => {
  try {
    files.forEach((file) => {
      fs.unlinkSync(file);
    });
  } catch (error) {
    appLogger.error("Error al eliminar archivos locales: ", error);
  }
};

export const getBrands = async () => {
  try {
    const brandList = await brandSchema.find();
    return brandList;
  } catch (error) {
    appLogger.error("Error al obtener las marcas:");
  }
};
