import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { MailOptions } from './interfaces/mail-options.interface';
import { sendMail } from '../../utils/mailer';
import { AuthService } from '../auth/auth.service';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

@Injectable()
export class MailService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  
  async sendEndPlan(emailUser: string, username: string) {
    const mailOptions: MailOptions = {
      to: emailUser,
      subject: '¡Tu plan premium está por terminar!',
      html: `
        <h1>Hola, ${username} 👋</h1>
        <p>Esperamos que hayas disfrutado al máximo de los beneficios de tu plan premium en <strong>Buddify</strong>.</p>
        <p>Queremos informarte que tu plan premium está a solo <strong>7 días</strong> de expirar.</p>
        <p>Para asegurarte de que sigues disfrutando de todas las ventajas, renueva tu plan ahora:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a 
            href="${process.env.URL_FRONT}/renew" 
            style="background-color: #ff5252; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;"
          >
            Renovar mi plan
          </a>
        </p>
        <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. Estamos aquí para ti. 💖</p>
        <p>Gracias por ser parte de <strong>Buddify</strong>. ¡Nos encanta tenerte con nosotros!</p>
        <p>Con cariño,</p>
        <p><strong>El equipo de Buddify</strong></p>
      `,
    };
    await sendMail(mailOptions);
  }

  async sendWelcomeEmail(emailUser: string, username: string) {
    const mailOptions: MailOptions = {
      to: emailUser,
      subject: 'Te damos la bienvenida a la comunidad de Buddify!',
      html: `
            <h1>¡Hola, ${username}!</h1>
            <p>Nos llena de alegría darte la bienvenida a <strong>Buddify</strong> 🎉</p>
            <p>Ahora eres parte de una comunidad increíble donde podrás conectar con personas únicas y compartir actividades que te apasionan. Desde partidos de fútbol hasta clubes de lectura, ¡hay algo para todas las personas! 🏃‍♂️📚</p>
            <p>Tu aventura social comienza ahora, y estamos aquí para apoyarte en cada paso del camino. Si en algún momento necesitas ayuda o tienes alguna pregunta, no dudes en contactarnos. 🤗</p>
            <p>Explora las actividades disponibles, descubre nuevas experiencias y vive momentos inolvidables con otros miembros de nuestra comunidad.</p>
            <p>¡Te damos la más cálida bienvenida! Disfruta de este viaje lleno de diversión y conexión en <strong>Buddify</strong> ✨</p>

            `,
    };
    await sendMail(mailOptions);
  }

  async sendPasswordResetEmail(emailUser: string, username: string) {
    const resetToken = await this.authService.generateResetToken(emailUser);
    const resetUrl = `${process.env.URL_FRONT}/reset-password?tokenreset=${resetToken}`;

    const mailOptions: MailOptions = {
      to: emailUser,
      subject: 'Recuperación de contraseña - Buddify',
      html: `
            <h1>¡Hola, ${username}!</h1>
            <p>Sabemos que a veces las cosas pueden olvidarse, ¡y no pasa nada! 😊</p>
            <p>Recibimos tu solicitud para restablecer tu contraseña en <strong>Buddify</strong>. Queremos ayudarte a volver a tu comunidad lo antes posible.</p>
            <p>Para continuar, solo haz clic en el siguiente enlace:</p>
            <p style="text-align: center; margin: 20px 0;">
              <a 
                href="${resetUrl}" 
                style="background-color: #ff5252; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;"
              >
                Restablecer mi contraseña
              </a>
            </p>
            <p>Este enlace es válido durante las próximas <strong>24 horas</strong>. Si no solicitaste restablecer tu contraseña, puedes ignorar este correo; tu cuenta estará segura. 💖</p>
            <p>Si necesitas ayuda adicional, no dudes en contactarnos. Estamos aquí para ti. 🤗</p>
            <p>Gracias por ser parte de <strong>Buddify</strong>. ¡Nos encanta tenerte con nosotros!</p>
            <p>Con cariño,</p>
            <p><strong>El equipo de Buddify</strong></p>

            `,
    };
    await sendMail(mailOptions);
  }
}
