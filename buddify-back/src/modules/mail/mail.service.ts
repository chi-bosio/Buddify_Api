import { Injectable } from '@nestjs/common';
import { MailOptions } from './interfaces/mail-options.interface';
import { sendMail } from 'src/utils/mailer';

@Injectable()
export class MailService {
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
}
