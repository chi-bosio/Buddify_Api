import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateActivityDto } from './dtos/create-activity.dto';
import { ActivityService } from './activity.service';
import { SearchActivitiesDto } from './dtos/search-activities.dto';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { Role } from 'utils/roles';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('search')
  searchActivities(@Query() query: SearchActivitiesDto) {
    return this.activityService.searchActivities(query);
  }

  @Get('user/:userId')
  async getUserActivities(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.activityService.getUserActivities(userId);
  }

  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<{ message: string }> {
    return this.activityService.create(createActivityDto);
  }

  @Post(':activityId/join/:userId')
  async joinActivity(
    @Param('activityId', ParseUUIDPipe) activityId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.activityService.joinActivity(activityId, userId);
  }

  @Post(':activityId/cancell/:userId')
  async cancellActivity(
    @Param('activityId', ParseUUIDPipe) activityId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.activityService.cancellActivity(activityId, userId);
  }
  @Get('count-created')
  async getUserCreatedActivitiesCount(@Query('userId') userId: string) {
    return this.activityService.getUserCreatedActivitiesCount(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async getActivities() {
    return this.activityService.getActivities();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total-by-month')
  async getTotalActivitiesByMonth() {
    return this.activityService.getTotalActivitiesByMonth();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total-by-country')
  async getTotalActivitiesByCountry() {
    return this.activityService.getTotalActivitiesByCountry();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total')
  async getTotalActivities() {
    return this.activityService.getTotalActivities();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total-success')
  async getTotalActivitiesSuccess() {
    return this.activityService.getTotalActivitiesSuccess();
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total-confirmed')
  async getTotalActivitiesConfirmed() {
    return this.activityService.getTotalActivitiesConfirmed();
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total-pending')
  async getTotalActivitiesPending() {
    return this.activityService.getTotalActivitiesPending();
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total-cancelled')
  async getTotalActivitiesCancelled() {
    return this.activityService.getTotalActivitiesCancelled();
  }
  
}
