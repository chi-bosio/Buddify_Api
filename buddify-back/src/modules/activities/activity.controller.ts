import { Body, Controller, Post } from "@nestjs/common";
import { CreateActivityDto } from "./dtos/CreateActivity.dto";
import { Activity } from "./activity.entity";
import { ActivityService } from "./activity.service";

@Controller('activities')

export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}


  @Post()
  async create(@Body() createActivityDto: CreateActivityDto): Promise<{message:string}> {
    return this.activityService.create(createActivityDto);
  }

}