import { Router } from "express";
import { createClients, getClients, getClient, updateClient, imageUpdate, getAllBrands, clientDelete } from "../controller/client.controller.js";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const clientsRouter = Router();

clientsRouter.post('/', upload.fields([{
    name: 'brand', maxCount: 1
}, {
    name: 'files', maxCount: 6
},
{
    name: 'hero', maxCount: 1
}
]), createClients);
clientsRouter.put('/:id', updateClient);
clientsRouter.get('/brands', getAllBrands)
clientsRouter.get('/', getClients);
clientsRouter.post('/imageUpdate', upload.single('image') ,imageUpdate)
clientsRouter.get('/:id', getClient);
clientsRouter.delete('/:id', clientDelete)

export default clientsRouter;