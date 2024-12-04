import { Module } from '@nestjs/common';
import ormConfig from 'config/ormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/auth.module';
import { CategoryModule } from 'modules/categories/category.module';
import { StripeModule } from 'modules/stripe/stripe.module';
import { UsersModule } from 'modules/users/users.module';
import { ActivityModule } from 'modules/activities/activity.module';
import { TasksModule } from 'modules/task/task.module';
import { ReportModule } from 'modules/reportactivities/report.module';
import { GatewayModule } from 'modules/chat/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UsersModule,
    AuthModule,
    ActivityModule,
    CategoryModule,
    StripeModule,
    TasksModule,
    ReportModule,
    GatewayModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
