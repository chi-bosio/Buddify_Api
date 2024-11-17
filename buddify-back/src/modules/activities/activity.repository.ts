import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateActivityDto } from "./dtos/CreateActivity.dto";
import { Activity } from "./activity.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";

@Injectable()
export class ActivityRepository {
  constructor(@InjectRepository(Activity)
  private readonly activityRepository: Repository<Activity>,
  private   readonly usersService: UsersService
) {}

  async create(createActivityDto: CreateActivityDto): Promise<{message:string}> {
    const userExist= await this.usersService.findById(createActivityDto.creatorId);
    if(!userExist) {
      throw new BadRequestException('Usuario inexistente');
    }
    const newActivity = {
      name: createActivityDto.name,
      description: createActivityDto.description,
      image: createActivityDto.image,
      date: new Date(createActivityDto.date), 
      time: createActivityDto.time,
      place: createActivityDto.place,
      latitude: createActivityDto.latitude,
      longitude: createActivityDto.longitude,
      creator: userExist
    };
    await this.activityRepository.save(newActivity);
    return {message: 'Actividad creada con exito'};
  }
}