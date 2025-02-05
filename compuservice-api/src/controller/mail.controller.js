import { appLogger } from "../config/loggers.config.js";
import { clientMail } from "../services/mail.services.js";

export const sendMail = async (req, res) => {
  try {
    const { name, email, phone, query } = req.body;

    if (!name || !email || !phone || !query) {
      appLogger.warn("Faltan datos en la solicitud");
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const user = {
      name,
      email,
      phone,
      query,
    };

    const newMail = await clientMail(user);

    appLogger.info("Correo enviado con éxito");
    return res
      .status(200)
      .json({ message: "Correo enviado con éxito", newMail });
  } catch (error) {
    appLogger.error(error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};
