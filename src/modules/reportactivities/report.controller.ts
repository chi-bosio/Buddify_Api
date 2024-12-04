import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './report-activity-dto';
import { Report } from './report.entity';
import { AuthGuard } from 'guards/auth.guard';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guards/roles.guard';
import { Role } from 'utils/roles';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async createReport(
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    return this.reportService.createReport(createReportDto);
  }

  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async getActivitiesReported() {
    return this.reportService.getActivitiesReported();
  }
}
