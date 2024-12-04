import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { MailOptions } from './interfaces/mail-options.interface';
import { sendMail } from '../../utils/mailer';
import { AuthService } from '../auth/auth.service';
import * as dotenv from 'dotenv';
import * as moment from 'moment';
dotenv.config({ path: './.env' });

@Injectable()
export class MailService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async sendWanringEndPlan(emailUser: string, username: string) {
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

  async sendExpiredPlanNotification(emailUser: string, username: string) {
    const mailOptions: MailOptions = {
      to: emailUser,
      subject: '¡Tu plan premium ha expirado!',
      html: `
        <h1>Hola, ${username} 👋</h1>
        <p>Tu plan premium en <strong>Buddify</strong> ha expirado. Lamentamos que ya no estés disfrutando de los beneficios exclusivos de nuestro servicio.</p>
        <p>Para continuar accediendo a todas las ventajas que ofrece nuestro plan premium, puedes renovarlo en cualquier momento.</p>
        <p style="text-align: center; margin: 20px 0;">
          <a 
            href="${process.env.URL_FRONT}/plans" 
            style="background-color: #ff5252; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;"
          >
            Ver planes y renovar
          </a>
        </p>
        <p>Si tienes alguna duda o necesitas más información, no dudes en contactarnos. Estamos aquí para ayudarte. 💖</p>
        <p>Gracias por ser parte de <strong>Buddify</strong>. ¡Esperamos verte pronto de nuevo!</p>
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

  async sendPasswordUpdatedEmail(emailUser: string, username: string) {
    const mailOptions: MailOptions = {
      to: emailUser,
      subject: 'Tu contraseña ha sido actualizada - Buddify',
      html: `
            <h1>¡Hola, ${username}!</h1>
            <p>Queremos confirmarte que tu contraseña ha sido actualizada con éxito en <strong>Buddify</strong>. 😊</p>
            <p>Sabemos lo importante que es mantener tu cuenta segura, y queremos que sepas que todo está en orden. Ahora puedes acceder a tu cuenta con tu nueva contraseña y seguir disfrutando de todas las experiencias increíbles que nuestra comunidad tiene para ofrecer. ✨</p>
            <p>Si no realizaste este cambio, por favor contáctanos de inmediato para proteger tu cuenta. Tu seguridad es nuestra prioridad. 💖</p>
            <p>Estamos aquí para ayudarte con lo que necesites. No dudes en escribirnos si tienes alguna pregunta o inquietud. 🤗</p>
            <p>¡Gracias por ser parte de <strong>Buddify</strong>! Continuemos creando momentos inolvidables juntos.</p>
            <p>Con cariño,</p>
            <p><strong>El equipo de Buddify</strong></p>
            `,
    };
    await sendMail(mailOptions);
  }

  async sendActivityCreatedEmail(
    emailUser: string,
    username: string,
    activity: { name: string; date: Date; time: string; place: string },
  ): Promise<void> {
    const formattedDate = moment(activity.date).utc().format('DD/MM/YYYY');

    const mailOptions: MailOptions = {
      to: emailUser,
      subject: '¡Tu actividad ha sido creada con éxito! - Buddify',
      html: `
        <h1>¡Hola, ${username}!</h1>
        <p>¡Tu nueva actividad, <strong>${activity.name}</strong>, ha sido creada con éxito en <strong>Buddify</strong>! 🎉</p>
        <p>Detalles de la actividad:</p>
        <ul>
          <li><strong>Fecha:</strong> ${formattedDate}</li>
          <li><strong>Hora:</strong> ${activity.time}</li>
          <li><strong>Ubicación:</strong> ${activity.place}</li>
        </ul>
        <p>Estamos emocionados por la experiencia que estás creando para nuestra comunidad. 🥳</p>
        <p>Recuerda que puedes gestionar tus actividades en la sección <strong>Mis actividades</strong>.</p>
        <p>¡Gracias por hacer de Buddify un lugar lleno de momentos inolvidables!</p>
        <p>Con cariño,</p>
        <p><strong>El equipo de Buddify</strong></p>
      `,
    };

    await sendMail(mailOptions);
  }

  async sendActivityCanceledByCreatorEmail(
    emailUser: string,
    username: string,
    activity: { name: string; date: Date; time: string; place: string },
  ): Promise<void> {
    const formattedDate = moment(activity.date).utc().format('DD/MM/YYYY');

    const mailOptions: MailOptions = {
      to: emailUser,
      subject: 'Confirmación de cancelación de actividad - Buddify',
      html: `
        <h1>¡Hola, ${username}!</h1>
        <p>Te confirmamos que la actividad <strong>${activity.name}</strong> que habías creado en <strong>Buddify</strong> ha sido cancelada exitosamente. 🙁</p>
        <p>Sabemos que no es fácil tomar decisiones como esta, pero entendemos que a veces las circunstancias lo requieren.</p>
        <p>Detalles de la actividad cancelada:</p>
        <ul>
          <li><strong>Nombre:</strong> ${activity.name}</li>
          <li><strong>Fecha:</strong> ${formattedDate}</li>
          <li><strong>Hora:</strong> ${activity.time}</li>
          <li><strong>Ubicación:</strong> ${activity.place}</li>
        </ul>
        <p>La comunidad será notificada sobre esta cancelación, y esperamos que pronto puedas crear nuevas actividades que enriquezcan la experiencia de todos. 🌟</p>
        <p>Si necesitas asistencia para gestionar tus actividades, no dudes en contactarnos. Estamos aquí para ayudarte. 🤗</p>
        <p>Gracias por tu esfuerzo y por contribuir a <strong>Buddify</strong>. ¡Esperamos verte de nuevo pronto organizando actividades!</p>
        <p>Con cariño,</p>
        <p><strong>El equipo de Buddify</strong></p>
      `,
    };

    await sendMail(mailOptions);
  }

  async sendJoinedActivityEmail(
    emailUser: string,
    username: string,
    activity: { name: string; date: Date; time: string; place: string },
  ): Promise<void> {
    const formattedDate = moment(activity.date).utc().format('DD/MM/YYYY');

    const mailOptions: MailOptions = {
      to: emailUser,
      subject: '¡Te has unido a una actividad! - Buddify',
      html: `
        <h1>¡Hola, ${username}!</h1>
        <p>¡Qué emoción! Te has unido a la actividad <strong>${activity.name}</strong> en <strong>Buddify</strong>. 🎉</p>
        <p>Detalles de la actividad:</p>
        <ul>
          <li><strong>Fecha:</strong> ${formattedDate}</li>
          <li><strong>Hora:</strong> ${activity.time}</li>
          <li><strong>Ubicación:</strong> ${activity.place}</li>
        </ul>
        <p>Estamos seguros de que será una experiencia increíble junto a la comunidad. 🥳</p>
        <p>Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.</p>
        <p>¡Disfruta de esta actividad y vive momentos inolvidables!</p>
        <p>Con cariño,</p>
        <p><strong>El equipo de Buddify</strong></p>
      `,
    };

    await sendMail(mailOptions);
  }

  async sendCanceledParticipationEmail(
    emailUser: string,
    username: string,
    activity: { name: string; date: Date; time: string; place: string },
  ): Promise<void> {
    const formattedDate = moment(activity.date).utc().format('DD/MM/YYYY');

    const mailOptions: MailOptions = {
      to: emailUser,
      subject: 'Cancelación de tu participación en una actividad - Buddify',
      html: `
        <h1>¡Hola, ${username}!</h1>
        <p>Queremos confirmarte que has cancelado tu participación en la actividad <strong>${activity.name}</strong> en <strong>Buddify</strong>. 😔</p>
        <p>Detalles de la actividad:</p>
        <ul>
          <li><strong>Fecha:</strong> ${formattedDate}</li>
          <li><strong>Hora:</strong> ${activity.time}</li>
          <li><strong>Ubicación:</strong> ${activity.place}</li>
        </ul>
        <p>Lamentamos que no puedas asistir esta vez, pero estamos seguros de que habrá muchas otras oportunidades para compartir momentos únicos con la comunidad. 🌟</p>
        <p>Si necesitas ayuda o tienes alguna pregunta, estamos aquí para apoyarte.</p>
        <p>¡Gracias por formar parte de Buddify!</p>
        <p>Con cariño,</p>
        <p><strong>El equipo de Buddify</strong></p>
      `,
    };

    await sendMail(mailOptions);
  }

  async sendActivityCanceledToParticipantsEmail(
    emailUser: string,
    username: string,
    activity: { name: string; date: Date; time: string; place: string },
  ): Promise<void> {
    const formattedDate = moment(activity.date).utc().format('DD/MM/YYYY');

    const mailOptions: MailOptions = {
      to: emailUser,
      subject: 'Cancelación de actividad - Buddify',
      html: `
        <h1>¡Hola, ${username}!</h1>
        <p>Te informamos que la actividad <strong>${activity.name}</strong>, a la que estabas inscrito, ha sido cancelada por el organizador. 🙁</p>
        <p>Entendemos que esto puede ser decepcionante, pero a veces surgen imprevistos. Esperamos que encuentres otras actividades interesantes en nuestra comunidad.</p>
        <p>Detalles de la actividad cancelada:</p>
        <ul>
          <li><strong>Nombre:</strong> ${activity.name}</li>
          <li><strong>Fecha:</strong> ${formattedDate}</li>
          <li><strong>Hora:</strong> ${activity.time}</li>
          <li><strong>Ubicación:</strong> ${activity.place}</li>
        </ul>
        <p>Te invitamos a explorar más actividades y a seguir conectando con nuestra comunidad. ¡Seguro encontrarás experiencias maravillosas! 🌟</p>
        <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte. 🤗</p>
        <p>Gracias por formar parte de <strong>Buddify</strong>. ¡Esperamos verte pronto en otras actividades!</p>
        <p>Con cariño,</p>
        <p><strong>El equipo de Buddify</strong></p>
      `,
    };

    await sendMail(mailOptions);
  }

  async sendBanNotification(emailUser: string, username: string) {
    const mailOptions: MailOptions = {
      to: emailUser,
      subject: 'Tu cuenta ha sido baneada en Buddify',
      html: `
        <h1>Hola, ${username} 👋</h1>
        <p>Lamentamos informarte que tu cuenta en <strong>Buddify</strong> ha sido baneada debido a un incumplimiento de nuestras normas comunitarias.</p>
        <p>Si crees que esto ha sido un error o si deseas más información, por favor contacta con nuestro equipo de soporte a través del siguiente enlace:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a 
            href="${process.env.URL_FRONT}/support" 
            style="background-color: #ff5252; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;"
          >
            Contactar Soporte
          </a>
        </p>
        <p>Te pedimos disculpas por cualquier inconveniente. Esperamos poder aclarar esta situación.</p>
        <p>Con cariño,</p>
        <p><strong>El equipo de Buddify</strong></p>
      `,
    };

    await sendMail(mailOptions);
  }
}
