import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dtos/send-message.dto';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(sendMessageDto: SendMessageDto): Promise<Message> {

    const message = this.messageRepository.create({
      text: sendMessageDto.text,
      sender: { id: sendMessageDto.senderId },
      activity: { id: sendMessageDto.activityId },
    });

    return await this.messageRepository.save(message);
  }

  async getMessagesByActivity(activityId: string, limit: number = 30): Promise<Message[]> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.activity', 'activity')
      .select([
        'message.id',
        'message.text',
        'message.createdAt',
        'sender.id',
        'sender.name',
        'sender.lastname',
        'sender.avatar',
        'activity.id',
        'activity.name',
        'activity.place',
      ])
      .where('message.activityId = :activityId', { activityId })
      .orderBy('message.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }
}
