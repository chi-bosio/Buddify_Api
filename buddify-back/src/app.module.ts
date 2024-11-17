import { Module } from '@nestjs/common';
import ormConfig from './config/ormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/Users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), 
    UsersModule,
    AuthModule,
   
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
