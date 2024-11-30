import { Controller, Post, Body } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './report-activity-dto';
import { Report } from './report.entity';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async createReport(
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    return this.reportService.createReport(createReportDto);
  }
}
