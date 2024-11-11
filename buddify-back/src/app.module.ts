import { Module } from '@nestjs/common';
import ormConfig from './config/ormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './Users/users.module';


@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
