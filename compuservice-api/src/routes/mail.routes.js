import { Router } from "express";
import { sendMail } from "../controller/mail.controller.js";

const clientMail = Router();

clientMail.post('/mailClient', sendMail);

export default clientMail