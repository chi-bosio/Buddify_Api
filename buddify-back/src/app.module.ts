import { Module } from '@nestjs/common';
import ormConfig from './config/ormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ActivityModule } from './modules/activities/Activity.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), 
    UsersModule,
    AuthModule,
    ActivityModule
  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
