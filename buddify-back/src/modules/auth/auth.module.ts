import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/users.entity';
import { Credentials } from '../../credentials/credentials.entity';
import { UsersRepository } from '../Users/users.repository';
import { UsersService } from '../Users/users.service';
import { MailModule } from '../mail/mail.module';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import googleOathConfig from 'src/modules/auth/config/google-oath.config';
import GoogleStrategy from './strategies/google.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Credentials]),
    MailModule,
    ConfigModule.forFeature(googleOathConfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [UsersService, UsersRepository, AuthService, GoogleStrategy],
})
export class AuthModule {}
