import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Activity } from "./activity.entity";
import { ActivityController } from "./activity.controller";
import { ActivityService } from "./activity.service";
import { ActivityRepository } from "./activity.repository";
import { UsersService } from "../users/users.service";
import { UsersRepository } from "../users/users.repository";
import { Users } from "../users/users.entity";
import { MailService } from "../mail/mail.service";
import { Credentials } from "src/modules/credentials/credentials.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Activity,Users,Credentials])],
    controllers: [ActivityController],
    providers: [ActivityService,
       ActivityRepository,
       UsersService,
       UsersRepository,
       MailService],
  })
  export class ActivityModule {}