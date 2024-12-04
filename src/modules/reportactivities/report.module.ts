import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Report } from './report.entity';
import { Activity } from 'modules/activities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report,Activity])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
