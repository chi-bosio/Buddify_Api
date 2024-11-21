import { Injectable } from "@nestjs/common";
import { CreateActivityDto } from "./dtos/CreateActivity.dto";
import { ActivityRepository } from "./activity.repository";
import { SearchActivitiesDto } from "./dtos/SearchActivitiesDto.dto";

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async create(createActivityDto: CreateActivityDto): Promise<{message:string}> {
    return this.activityRepository.create(createActivityDto);
  }

  async searchActivities(query: SearchActivitiesDto): Promise<{ data: any[]; total: number }> {
    return this.activityRepository.searchActivities(query);
  }

  async joinActivity(activityId: string, userId: string): Promise<{message:string}> {
    return this.activityRepository.joinActivity(activityId,userId);
  }
}
