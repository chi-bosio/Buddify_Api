import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateActivityDto } from "./dtos/CreateActivity.dto";
import { Activity } from "./activity.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { SearchActivitiesDto } from "./dtos/SearchActivitiesDto.dto";
import { Category } from "../categories/category.entity";

@Injectable()
export class ActivityRepository {
  constructor(@InjectRepository(Activity)
  private readonly activityRepository: Repository<Activity>,
  private readonly usersService: UsersService,
  @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
) {}

async create(createActivityDto: CreateActivityDto): Promise<{message:string}> {
  const userExist= await this.usersService.findById(createActivityDto.creatorId);
  if(!userExist) {
    throw new BadRequestException('Usuario inexistente');
  }
  const categoryExist= await this.categoryRepository.findOne({where: {id:createActivityDto.categoryId}});
  if(!categoryExist) {
    throw new BadRequestException('Categoria inexistente');
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
    creator: userExist,
    category:categoryExist,
  };
  await this.activityRepository.save(newActivity);
  return {message: 'Actividad creada con exito'};
}
 
async searchActivities(query: SearchActivitiesDto): Promise<{ data: any[]; total: number }> {
  const { latitude, longitude, radius = 10, categoryId, userId, dateStart, dateEnd, page = 1, limit = 8 } = query;

  const latitudeNumber = Number(latitude);  
  const longitudeNumber = Number(longitude);  
  const radiusNumber = Number(radius);

  const haversineFormula = `
    6371 * acos(
      cos(radians(:latitude::float)) * cos(radians(activity.latitude::float)) *
      cos(radians(activity.longitude::float) - radians(:longitude::float)) +
      sin(radians(:latitude::float)) * sin(radians(activity.latitude::float))
    )
  `;

  const queryBuilder = this.activityRepository
    .createQueryBuilder('activity')
    .leftJoinAndSelect('activity.creator', 'creator')
    .leftJoinAndSelect('activity.participants', 'participant')
    .leftJoinAndSelect('activity.category', 'category') 
    .where(haversineFormula + ' <= :radius', { latitude: latitudeNumber, longitude: longitudeNumber, radius: radiusNumber });

  queryBuilder.andWhere('activity.creatorId != :userId', { userId });
  queryBuilder.andWhere('activity.id NOT IN (SELECT "activityId" FROM user_activity WHERE "userId" = :userId)', { userId });

  if (categoryId) {
    queryBuilder.andWhere('activity.category.id = :categoryId', { categoryId });
  }

  if (dateStart && dateEnd) {
    queryBuilder.andWhere('activity.date BETWEEN :dateStart AND :dateEnd', { dateStart, dateEnd });
  } else if (dateStart) {
    queryBuilder.andWhere('activity.date >= :dateStart', { dateStart });
  } else if (dateEnd) {
    queryBuilder.andWhere('activity.date <= :dateEnd', { dateEnd });
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const [activities, total] = await queryBuilder
    .skip((pageNumber - 1) * limitNumber)
    .take(limitNumber)
    .getManyAndCount();

    const data = activities.map(activity => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      image: activity.image,
      date: activity.date,
      time: activity.time,
      place: activity.place,
      latitude: activity.latitude,
      longitude: activity.longitude,
      creator: {
        name: activity.creator?.name || '',
        lastname: activity.creator?.lastname || '',
        avatar: activity.creator?.avatar || '',
      },
      category: {
        id: activity.category?.id || '',
        name: activity.category?.name || '',
      },
    }));
    

  return { data, total };
}

}