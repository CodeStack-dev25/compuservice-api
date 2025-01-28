import { getAllClients, newClient, getClientById, upClient, deleteLocalFiles, getBrands, deleteClient } from "../services/client.services.js";
import { appLogger } from '../config/loggers.config.js'
import cloudinary from '../config/cloudinary.config.js';
import clientsModels from "../models/clients.models.js";

export const createClients = async (req, res) => {
    try {
        const { name, location, phone, email, description } = req.body;
        const { brand, files, hero } = req.files;

        const resultHero = await cloudinary.uploader.upload(hero[0].path, { folder: 'clients' });
        const resultBrand = await cloudinary.uploader.upload(brand[0].path, { folder: 'clients' });
        const thumbnail = [];
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, { folder: 'clients' });
            thumbnail.push({
                url: result.secure_url,
                public_id: result.public_id
            });
        }
        deleteLocalFiles([hero[0].path, brand[0].path, ...files.map(file => file.path)]);
        const addClient = {
            hero: { url: resultHero.url, public_id: resultHero.public_id },
            brand: { url: resultBrand.url, public_id: resultBrand.public_id },
            name,
            location,
            phone,
            email,
            description,
            thumbnail
        }

        const client = await newClient(addClient);
        appLogger.info(`Client created`);
        return res.status(201).json(client);

    }
    catch (error) {
        appLogger.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const getClients = async (req, res) => {
    try {
        const clients = await getAllClients();
        appLogger.info(`Clients retrieved`);
        return res.status(200).json(clients);
    }
    catch (error) {
        appLogger.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const getClient = async (req, res) => {
    try {
        const id = req.params.id;
        
        const client = await getClientById(id);
        if (!client) {
            appLogger.warn(`Client not found`);
            return res.status(404).json({ message: "Client not found" });
        }
        appLogger.info(`Client retrieved`);
        return res.status(200).json(client);
    }
    catch (error) {
        appLogger.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params
        const updatedClient = await upClient(id, req.body);
        appLogger.info(`Client updated`);
        return res.status(200).json(updatedClient);

    }
    catch (error) {
        appLogger.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const clientDelete = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener el cliente por ID
        const client = await getClientById(id);

        if (!client) {
            appLogger.warn(`Client not found`);
            return res.status(404).json({ message: "Client not found" });
        }

        // Eliminar imágenes relacionadas en Cloudinary
        const { hero, brand, thumbnail } = client;

        // Eliminar imagen de 'hero' en Cloudinary
        if (hero?.public_id) {
            await cloudinary.uploader.destroy(hero.public_id);
            appLogger.info(`Hero image deleted: ${hero.public_id}`);
        }

        // Eliminar imagen de 'brand' en Cloudinary
        if (brand?.public_id) {
            await cloudinary.uploader.destroy(brand.public_id);
            appLogger.info(`Brand image deleted: ${brand.public_id}`);
        }

        // Eliminar imágenes de 'thumbnail' en Cloudinary
        if (thumbnail?.length > 0) {
            for (const thumb of thumbnail) {
                if (thumb.public_id) {
                    await cloudinary.uploader.destroy(thumb.public_id);
                    appLogger.info(`Thumbnail image deleted: ${thumb.public_id}`);
                }
            }
        }

        // Eliminar el cliente de la base de datos
        const deletedClient = await deleteClient(id);
        appLogger.info(`Client deleted: ${id}`);

        return res.status(200).json(deletedClient);
    } catch (error) {
        appLogger.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
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
                $set: { "thumbnail.$.url": result.secure_url }
            },
            { new: true, useFindAndModify: false }
        );

        if (!updatedDocument) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        deleteLocalFiles([file.path]);

        appLogger.info(`Image updated successfully: ${public_id}`);
        return res.status(200).json({
            message: "Image updated successfully",
            data: result,
        });
    } catch (error) {
        appLogger.error(`Error updating image: ${error.message}`);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const getAllBrands = async (req, res) => {
    try {
        const brandList = await getBrands();

        appLogger.info(`Brands retrieved successfully.`);
        return res.status(200).json({
            message: "Brands retrieved successfully",
            data: brandList,
        });
    } catch (error) {
        appLogger.error(`Error retrieving brands: ${error.message}`);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
