import { Injectable } from '@nestjs/common';
import { MailOptions } from './interfaces/mail-options.interface';
import { sendMail } from 'src/utils/mailer';

@Injectable()
export class MailService {
  async sendWelcomeEmail(emailUser: string, username: string) {
    const mailOptions: MailOptions = {
      to: emailUser,
      subject: '¡Bienvenido/a a la comunidad de Buddify!',
      html: `
            <h1>¡Hola ${username}!</h1>
            <p>Nos emociona mucho tenerte con nosotros en <strong>Buddify</strong> 🎉</p>
            <p>¡Ahora formas parte de una comunidad donde podrás conocer personas increíbles y compartir actividades que te apasionan! Desde partidos de fútbol hasta clubes de lectura, hay algo para todos. 🏃‍♂️📚</p>
            <p>Tu viaje social comienza ahora, y estamos aquí para acompañarte en cada paso. Si alguna vez necesitas ayuda o tienes alguna duda, no dudes en contactarnos. 🤗</p>
            <p>¡No olvides explorar todas las actividades que tenemos para ti y disfrutar de nuevas experiencias con otros miembros!</p>
            <p>¡Bienvenido/a a bordo y a disfrutar de este viaje de diversión Buddify</strong></p>
            `,
    };
    await sendMail(mailOptions);
  }
}
