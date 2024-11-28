import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'modules/activities/activity.entity';
import { Payment } from 'modules/stripe/payment.entity';
import { Users } from 'modules/users/users.entity';
import { MailService } from 'modules/mail/mail.service';
import { StripeService } from 'modules/stripe/stripe.service';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Activity,Payment,Users])],
  providers: [TasksService,MailService,StripeService],
})
export class TasksModule {}
