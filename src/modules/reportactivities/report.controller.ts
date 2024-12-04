import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './report-activity-dto';
import { Report } from './report.entity';
import { AuthGuard } from 'guards/auth.guard';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReport(
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    return this.reportService.createReport(createReportDto);
  }
}
