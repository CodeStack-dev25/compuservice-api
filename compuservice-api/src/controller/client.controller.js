import { getAllClients, newClient, getClientById, upClient, deleteLocalFiles } from "../services/client.services.js";
import { appLogger } from '../config/loggers.config.js'
import cloudinary from '../config/cloudinary.config.js';

export const createClients = async (req, res) => {
    try {
        const { name, location, phone, email, description } = req.body;
        const { brand, files, hero } = req.files;
      
        const resultHero = await cloudinary.uploader.upload(hero[0].path, { folder: name });
        const resultBrand = await cloudinary.uploader.upload(brand[0].path, { folder: name });
        const thumbnail = [];
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, { folder: name });
            thumbnail.push({
                url: result.url,
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
        const { id } = req.params;
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

        const clientUpdate = req.body;

        const client = await getClientById(id);
        console.log(client);
        
        if (!client) {
            appLogger.warn(`Client not found`);
            return res.status(404).json({ message: "Client not found" });
        }
        
        const updatedClient = await upClient(id, clientUpdate);
        appLogger.info(`Client updated`);
        return res.status(200).json(updatedClient);

    }
    catch (error) {
        appLogger.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const imageUpdate = async (req, res) => {
    try {
        const { public_id} = req.body;
        const file = req.file;
        
        if (!public_id || !file) {
            appLogger.warn(`Image not found or public_id invalid`);
            return res.status(404).json({ message: "Image not found or public_id invalid" });
        }

        const result = await cloudinary.uploader.upload(file.path, {
            public_id,
            overwrite: true
         });
        deleteLocalFiles([file.path]);
        appLogger.info(`Image updated`);
        return res.status(200).json(result);
    }
    catch (error) {
        appLogger.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}
