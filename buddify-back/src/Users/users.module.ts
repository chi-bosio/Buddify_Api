import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { Credentials } from './credentials/credentials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users,Credentials])],
  controllers: [UsersController],
  providers: [UsersService,UsersRepository]
})
export class UsersModule {}
