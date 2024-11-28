import { Injectable } from "@nestjs/common";
import { CreateActivityDto } from "./dtos/create-activity.dto";
import { ActivityRepository } from "./activity.repository";
import { SearchActivitiesDto } from "./dtos/search-activities.dto";
import { Activity } from "./activity.entity";

@Injectable()
export class ActivityService {
  async create(
    createActivityDto: CreateActivityDto,
  ): Promise<{ message: string }> {
    return this.activityRepository.create(createActivityDto);
  }

  async searchActivities(
    query: SearchActivitiesDto,
  ): Promise<{ data: any[]; total: number }> {
    return this.activityRepository.searchActivities(query);
  }

  async joinActivity(
    activityId: string,
    userId: string,
  ): Promise<{ message: string }> {
    return this.activityRepository.joinActivity(activityId, userId);
  }
  async cancellActivity(
    activityId: string,
    userId: string,
  ): Promise<{ message: string }> {
    return this.activityRepository.cancellActivity(activityId, userId);
  }

  async getUserActivities(
    userId: string,
  ): Promise<{ created: Activity[]; joined: Activity[] }> {
    return this.activityRepository.getUserActivities(userId);
  }
  constructor(private readonly activityRepository: ActivityRepository) {}

  // Servicio -> ActivityService

  async getUserCreatedActivitiesCount(
    userId: string,
  ): Promise<{ count: number }> {
    return this.activityRepository.getUserCreatedActivitiesCount(userId);
  }
}
