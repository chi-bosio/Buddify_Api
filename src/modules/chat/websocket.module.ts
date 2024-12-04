import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'modules/activities/activity.entity';
import { UsersModule } from 'modules/users/users.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    UsersModule,
    MessageModule,
  ],
  providers: [WebsocketGateway],
})
export class GatewayModule {}
