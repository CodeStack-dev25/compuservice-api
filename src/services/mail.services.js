import { appLogger } from '../config/loggers.config.js';
import { queryMail } from '../utils/email.js'
import { transporter } from '../config/nodemailer.config.js';

export const clientMail = async (user) => {
    try {
        const email = await transporter.sendMail({
            from: user.mail,
            to: '<compuservice2025@gmail.com>',
            subject: `Consulta de ${user.name}`,
            html: queryMail(user),
        });
        appLogger.info('Correo enviado:', email.response);
        return email
    } catch (error) {
        appLogger.error('Error al enviar el correo:', error);
    }
};