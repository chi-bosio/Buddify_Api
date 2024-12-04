import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':activityId')
  async getMessages(@Param('activityId') activityId: string): Promise<Message[]> {
    return this.messageService.getMessagesByActivity(activityId);
  }
}
