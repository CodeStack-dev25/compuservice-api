import { Router } from "express";
import clientsRouter from "./clients.routes.js";


const indexRouter = Router();

indexRouter.use('/api/clients', clientsRouter)

export default indexRouter;