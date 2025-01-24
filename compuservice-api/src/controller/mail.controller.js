import { appLogger } from "../config/loggers.config.js"
import { clientMail } from "../services/mail.services.js"

export const sendMail = async (req, res) => {
    try {
        const { name, email, phone, query } = req.body;
        
        // Validación básica de los datos
        if (!name || !email || !phone || !query) {
            appLogger.warn('Faltan datos en la solicitud');
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear el objeto para enviar en el correo
        const user = {
            name,
            email,
            phone,
            query,
        };

        // Enviar el correo
        const newMail = await clientMail(user);

        appLogger.info('Correo enviado con éxito');
        return res.status(200).json({ message: 'Correo enviado con éxito', newMail });
    } catch (error) {
        appLogger.error('Error al enviar el correo:', error.message);
        return res.status(500).json({ message: 'Error interno al enviar el correo' });
    }
};