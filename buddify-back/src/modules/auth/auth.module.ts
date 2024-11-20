import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { Credentials } from '../credentials/credentials.entity';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { MailModule } from '../mail/mail.module';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import googleOathConfig from 'src/modules/auth/config/google-oath.config';
import GoogleStrategy from './strategies/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Credentials]),
    forwardRef(() => MailModule),
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(googleOathConfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [UsersService, UsersRepository, AuthService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
