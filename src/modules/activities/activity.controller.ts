import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CreateActivityDto } from "./dtos/CreateActivity.dto";
import { ActivityService } from "./activity.service";
import { SearchActivitiesDto } from "./dtos/SearchActivitiesDto.dto";

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
  async create(@Body() createActivityDto: CreateActivityDto): Promise<{message:string}> {
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

}