import { appLogger } from '../config/loggers.config.js';
import imageSchema from '../models/clients.models.js';
import fs from 'fs';

export const newClient = async (client) => {
    try{
        return await imageSchema.insertMany(client);
    }
    catch(error){
        appLogger.error('Error creating client: ', error);
    }
}

export const getAllClients = async () => {
    try{
        return await imageSchema.find();
    }
    catch(error){
        appLogger.error('Error getting clients: ', error);
    }
}

export const getClientByCode = async (code) => {
    try{
        return await imageSchema.findById(code);
    }
    catch(error){
        addEventListener.error('Error getting client: ', error);
    }
}

export const getClientById = async (id) => {
    try{
        return await imageSchema.findById(id);
    }
    catch(error){
        appLogger.error('Error getting client: ', error);
    }
}

export const upClient = async (id, client) => {
    try{
        return await imageSchema.findByIdAndUpdate(id, client, {new: true});
    }
    catch(error){
        appLogger.error('Error updating client: ', error);
    }
}

export const deleteClient = async (cid) => {
    try{
        return await imageSchema.findByIdAndDelete(cid);
    }
    catch(error){
        appLogger.error('Error deleting client: ', error);
    }
}

export const deleteLocalFiles = async (files) => {
    try{
        files.forEach(file => {
            fs.unlinkSync(file);
        });
    }
    catch(error){
        appLogger.error('Error deleting local files: ', error);
    }
}   