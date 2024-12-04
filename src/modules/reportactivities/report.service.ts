import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './report-activity-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'modules/activities/activity.entity';

@Injectable()
export class ReportService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Activity) private readonly activitiesRepository: Repository<Activity>,
  ) {}

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
 async getActivitiesReported(): Promise<Report[]> {
  return await this.entityManager.find(Report);
}
}
