import { Router } from "express";
import { createClients, getClients, getClient, updateClient, imageUpdate } from "../controller/client.controller.js";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const clientsRouter = Router();

clientsRouter.post('/', upload.fields([{
    name: 'brand', maxCount: 1
}, {
    name: 'files', maxCount: 3
},
{
    name: 'hero', maxCount: 1
}
]), createClients);
clientsRouter.get('/', getClients);
clientsRouter.put('/:id', updateClient);
clientsRouter.post('/imageUpdate', upload.single('image') ,imageUpdate)
clientsRouter.get('/:id', getClient);

export default clientsRouter;