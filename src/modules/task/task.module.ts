import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'modules/activities/activity.entity';
import { Payment } from 'modules/stripe/payment.entity';
import { Users } from 'modules/users/users.entity';
import { MailService } from 'modules/mail/mail.service';
import { StripeService } from 'modules/stripe/stripe.service';
import { AuthService } from 'modules/auth/auth.service';
import { Credentials } from 'modules/credentials/credentials.entity';
import { UsersService } from 'modules/users/users.service';
import { UsersRepository } from 'modules/users/users.repository';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Activity,Payment,Users,Credentials])],
  providers: [TasksService,MailService,StripeService,AuthService,UsersService,UsersRepository],
})
export class TasksModule {}
