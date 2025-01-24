import { Router } from "express";
import { login, logout } from "../controller/auth.controller.js";

const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.get('/logout', logout);

export default authRoutes;