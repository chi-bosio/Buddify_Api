import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityRepository } from './activity.repository';
import { Users } from '../users/users.entity';
import { MailService } from '../mail/mail.service';
import { Credentials } from 'src/modules/credentials/credentials.entity';
import { AuthModule } from '../auth/auth.module';
import { Category } from '../categories/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Users, Credentials, Category]),
    AuthModule,
  ],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    ActivityRepository,
    MailService,
  ],
})
export class ActivityModule {}
