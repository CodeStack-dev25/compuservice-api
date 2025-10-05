import {
  getAllClients,
  newClient,
  getClientById,
  upClient,
  deleteLocalFiles,
  getBrands,
  deleteClient,
} from "../services/client.services.js";
import { appLogger } from "../config/loggers.config.js";
import cloudinary from "../config/cloudinary.config.js";
import clientsModels from "../models/clients.models.js";

export const createClients = async (req, res) => {
  try {
    const { name, location, phone, email, description } = req.body;
    const { brand, files, hero } = req.files;

    const resultHero = await cloudinary.uploader.upload(hero[0].path, {
      folder: "clients",
    });
    const resultBrand = await cloudinary.uploader.upload(brand[0].path, {
      folder: "clients",
    });
    const thumbnail = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "clients",
      });
      thumbnail.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
    deleteLocalFiles([
      hero[0].path,
      brand[0].path,
      ...files.map((file) => file.path),
    ]);
    const addClient = {
      hero: { url: resultHero.url, public_id: resultHero.public_id },
      brand: { url: resultBrand.url, public_id: resultBrand.public_id },
      name,
      location,
      phone,
      email,
      description,
      thumbnail,
    };

    const client = await newClient(addClient);
    appLogger.info(`Cliente creado correctamente`);
    return res.status(201).json(client);
  } catch (error) {
    appLogger.error(error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const getClients = async (req, res) => {
  try {
    const clients = await getAllClients();
    if (!clients) {
      appLogger.warn(`Error al obtener los clientes`);
      return res.status(404).json({ message: "Clientes no encontrados" });
    }
    appLogger.info(`Clientes obtenidos correctamente`);
    return res.status(200).json(clients);
  } catch (error) {
    appLogger.error(error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const getClient = async (req, res) => {
  try {
    const id = req.params.id;

    const client = await getClientById(id);
    if (!client) {
      appLogger.warn(`Cliente no encontrado`);
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    appLogger.info(`Cliente encontrado correctamente`);
    return res.status(200).json(client);
  } catch (error) {
    appLogger.error(error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClient = await upClient(id, req.body);
    if (!updatedClient) {
      appLogger.error("Error al actualizar el cliente");
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    appLogger.info(`Cliente actualizado correctamente`);
    return res.status(200).json(updatedClient);
  } catch (error) {
    appLogger.error(error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const clientDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await getClientById(id);

    if (!client) {
      appLogger.warn(`Cliente no encontrado`);
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const { hero, brand, thumbnail } = client;

    if (hero?.public_id) {
      await cloudinary.uploader.destroy(hero.public_id);
      appLogger.info(`Imagen eliminada correctamente: ${hero.public_id}`);
    }

    if (brand?.public_id) {
      await cloudinary.uploader.destroy(brand.public_id);
      appLogger.info(`Imagen eliminada correctamente: ${brand.public_id}`);
    }

    if (thumbnail?.length > 0) {
      for (const thumb of thumbnail) {
        if (thumb.public_id) {
          await cloudinary.uploader.destroy(thumb.public_id);
          appLogger.info(
            `Imagenes eliminadas correctamente: ${thumb.public_id}`
          );
        }
      }
    }

    const deletedClient = await deleteClient(id);
    appLogger.info(`Cliente eliminado correctamente`);
    return res.status(200).json(deletedClient);
  } catch (error) {
    appLogger.error(error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const imageUpdate = async (req, res) => {
  try {
    const { public_id } = req.body;
    const file = req.file;

    if (!public_id || !file) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      public_id,
      overwrite: true,
      invalidate: true,
    });

    const updatedDocument = await clientsModels.findOneAndUpdate(
      { "thumbnail.public_id": public_id },
      {
        $set: { "thumbnail.$.url": result.secure_url },
      },
      { new: true, useFindAndModify: false }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    deleteLocalFiles([file.path]);

    appLogger.info(`Imagen actualizada correctamente`);
    return res.status(200).json({
      message: "Imagen actualizada correctamentey",
      data: result,
    });
  } catch (error) {
    appLogger.error(error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brandList = await getBrands();

    if (!brandList) {
      appLogger.error("Error al obtener las marcas");
      return res.status(500).json({ message: "Error al obtener las marcas" });
    }

    appLogger.info(`Marcas obtenidas correctamente`);
    return res.status(200).json({
      message: "Marcas obtenidas correctamente",
      data: brandList,
    });
  } catch (error) {
    appLogger.error(error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};
