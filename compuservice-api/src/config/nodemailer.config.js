import nodmailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth:{
        user: 'compuservice2025@gmail.com',
        pass: 'akyulzvycruiutnt'
    }
});