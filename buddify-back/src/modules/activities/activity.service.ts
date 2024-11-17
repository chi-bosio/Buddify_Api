import { Injectable } from "@nestjs/common";
import { CreateActivityDto } from "./dtos/CreateActivity.dto";
import { Activity } from "./activity.entity";
import { ActivityRepository } from "./activity.repository";

@Injectable()
export class ActivityService {
    constructor(private readonly activityRepository: ActivityRepository) {}
  async create(createActivityDto: CreateActivityDto): Promise<{message:string}> {
    return this.activityRepository.create(createActivityDto);
  }
}
