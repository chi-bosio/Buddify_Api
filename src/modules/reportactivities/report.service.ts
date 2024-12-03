import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './report-activity-dto';

@Injectable()
export class ReportService {
  constructor(private readonly entityManager: EntityManager) {}

  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    const { activityId, creatorName, reporterId, description } =
      createReportDto;

    const report = new Report();
    report.activityId = activityId;
    report.creatorName = creatorName;
    report.reporterId = reporterId;
    report.description = description;
    report.reportedAt = new Date();

    return await this.entityManager.save(Report, report);
  }
}
