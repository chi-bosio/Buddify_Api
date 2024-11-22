import { Module } from '@nestjs/common';
import ormConfig from './config/ormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ActivityModule } from './modules/activities/Activity.module';
import { CategoryModule } from './modules/categories/category.module';
import { StripeModule } from './modules/stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UsersModule,
    AuthModule,
    ActivityModule,
    CategoryModule,
    StripeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
