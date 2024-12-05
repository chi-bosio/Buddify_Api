import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Activity } from 'modules/activities/activity.entity';
import { UsersService } from 'modules/users/users.service';
import { Server, Socket } from 'socket.io';
import { Repository, Not, In } from 'typeorm';
import { MessageService } from '../message/message.service';
import { ActivityStatus } from 'modules/activities/enums/activity-status.enum';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: `process.env.URL_FRONT`,
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private messageService: MessageService,
  ) { }

  async handleConnection(client: Socket) {

    client.data = {};

    const token = client.handshake.auth.token;

    if (!token) {
        client.emit('error', 'Token no proporcionado');
        client.disconnect();
        return;
    }

    try {
        const decoded = this.jwtService.verify(token);

        const user = await this.usersService.findById(decoded.sub);
        if (!user) {
            client.emit('error', 'Usuario no encontrado');
            client.disconnect();
            return;
        }

        client.data.userId = user.id;
        client.data.username = user.name;
        client.data.lastname = user.lastname;
        client.data.avatar = user.avatar;

        let activityId = client.handshake.query.activityId;

        if (Array.isArray(activityId)) {
            activityId = activityId[0];
        }

        if (typeof activityId === 'string') {
            const activity = await this.activityRepository.findOne({
                where: {
                    id: activityId,
                    status: Not(In([ActivityStatus.SUCCESS, ActivityStatus.CANCELLED])),
                },
            });

            console.log(activity)

            if (activity) {
                client.join(`activity-${activityId}`);

                const recentMessages = await this.messageService.getMessagesByActivity(activityId, 30);
                client.emit('recentMessages', recentMessages);

                client.emit('activityDetails', activity);
            } else {
                client.emit('error', 'Actividad no encontrada o no activa');
                client.disconnect();
            }
        } else {
            client.emit('error', 'ID de actividad inválido');
            client.disconnect();
        }
    } catch (error) {
        console.error('Error al verificar token:', error);
        client.emit('error', 'Token inválido o expirado');
        client.disconnect();
    }
}

  handleDisconnect(client: Socket) {
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() message: { activityId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const senderId = client.data.userId;
      const sendername = client.data.username;
      const senderlastaname = client.data.lastname;
      const senderAvatar = client.data.avatar;

      if (!senderId) {
        client.emit('error', 'Usuario no autenticado');
        return;
      }

      if (!message.activityId) {
        client.emit('error', 'ID de actividad no proporcionado');
        return;
      }

      const savedMessage = await this.messageService.createMessage({
        activityId: message.activityId,
        text: message.text,
        senderId: senderId,
      });

      const messageToSend = {
        sender: {
          id: senderId,
          name: sendername,
          lastname: senderlastaname,
          avatar: senderAvatar,
        },
        text: savedMessage.text,
      };

      this.server.to(`activity-${message.activityId}`).emit(`activity-${message.activityId}`, messageToSend);

    } catch (error) {
      console.error('Error al manejar el mensaje:', error);
      client.emit('error', 'Error al enviar mensaje');
    }
  }
}
