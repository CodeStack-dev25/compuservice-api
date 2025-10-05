import { Router } from "express";
import { createClients, getClients, getClient, updateClient, imageUpdate, getAllBrands, clientDelete } from "../controller/client.controller.js";
import multer from 'multer';

const clientsRouter = Router();

const upload = multer({ dest: 'uploads/' });

clientsRouter.post('/', upload.fields([
    { name: 'brand', maxCount: 1 },
    { name: 'files', maxCount: 6 },
    { name: 'hero', maxCount: 1 }
]), createClients);

clientsRouter.get('/', getClients);
clientsRouter.put('/:id', updateClient);
clientsRouter.delete('/:id', clientDelete);
clientsRouter.get('/:id', getClient);
clientsRouter.post('/imageUpdate', upload.single('image'), imageUpdate);

export default clientsRouter;