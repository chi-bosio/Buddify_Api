import * as nodemailer from 'nodemailer';
import { SendMailOptions, Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';
import { MailOptions } from '../modules/mail/interfaces/mail-options.interface';

dotenv.config({ path: './.env.local' });

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Error interno con las credenciales');
}

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Ignorar la validación del certificado
  },
});

export const sendMail = async (options: MailOptions): Promise<void> => {
  const mailOptions: SendMailOptions = {
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Error al enviar el correo');
  }
};
