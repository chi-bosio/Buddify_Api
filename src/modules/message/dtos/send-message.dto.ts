import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsUUID()
  senderId: string;

  @IsUUID()
  activityId: string;
}
