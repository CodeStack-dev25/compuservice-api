import { Router } from "express";
import clientsRouter from "./clients.routes.js";
import clientMail from "./mail.routes.js";
import authRoutes from "./auth.routes.js";


const indexRouter = Router();

indexRouter.use('/api/clients', clientsRouter)
indexRouter.use('/api/mail', clientMail)
indexRouter.use('/api/auth', authRoutes)

export default indexRouter;