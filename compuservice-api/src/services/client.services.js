import { appLogger } from '../config/loggers.config.js';
import clientsSchema from '../models/clients.models.js';
import brandSchema from '../models/brand.models.js';
import fs from 'fs';

export const newClient = async (client) => {
    try{
        return await clientsSchema.insertMany(client);
    }
    catch(error){
        appLogger.error('Error creating client: ', error);
    }
}

export const getAllClients = async () => {
    try{
        return await clientsSchema.find();
    }
    catch(error){
        appLogger.error('Error getting clients: ', error);
    }
}

export const getClientByCode = async (code) => {
    try{
        return await clientsSchema.findById(code);
    }
    catch(error){
        appLogger.error('Error getting client: ', error);
    }
}

export const getClientById = async (id) => {
    try{
        const client = await clientsSchema.findById(id);
        return client
    }
    catch(error){
        appLogger.error('Error getting client: ', error);
    }
}

export const upClient = async (id, client) => {
    try{
        return await clientsSchema.findByIdAndUpdate(id, client, {new: true});
    }
    catch(error){
        appLogger.error('Error updating client: ', error);
    }
}

export const deleteClient = async (cid) => {
    try{
        return await clientsSchema.findByIdAndDelete(cid);
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

export const getBrands = async () =>{
    try {
        const brandList = await brandSchema.find();
        return brandList;
    }
    catch(error){
        appLogger.error ('Error getting brand')
    }
}
