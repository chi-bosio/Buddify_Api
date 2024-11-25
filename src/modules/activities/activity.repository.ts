import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateActivityDto } from "./dtos/CreateActivity.dto";
import { Activity } from "./activity.entity";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { SearchActivitiesDto } from "./dtos/SearchActivitiesDto.dto";
import { Category } from "../categories/category.entity";
import { Users } from "../users/users.entity";
import { EntityManager } from "typeorm";
import { ActivityStatus } from "./enums/ActivityStatus.enum";
import * as moment from "moment";

@Injectable()
export class ActivityRepository {
  constructor(@InjectRepository(Activity)
  private readonly activityRepository: Repository<Activity>,
  @InjectRepository(Users)
  private readonly userRepository: Repository<Users>,
  @InjectRepository(Category)
  private readonly categoryRepository: Repository<Category>,
  @InjectEntityManager() private readonly manager: EntityManager
) {}

async create(createActivityDto: CreateActivityDto): Promise<{message:string}> {
  const hours = Number(createActivityDto.time.split(":")[0]);
    const minutes = Number(createActivityDto.time.split(":")[1]);
    const actDate = new Date(createActivityDto.date);
    const formatDate  = moment(actDate).set({ hour: hours, minute: minutes }).format('YYYY/MM/DD');
  const userExist= await this.userRepository.findOne({where:{id:createActivityDto.creatorId}});
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
    date: formatDate, 
    time: createActivityDto.time,
    place: createActivityDto.place,
    latitude: createActivityDto.latitude,
    longitude: createActivityDto.longitude,
    creator: userExist,
    category:categoryExist,
    participants: []
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
    queryBuilder.andWhere('activity.status IN (:...statuses)', { statuses: [ActivityStatus.PENDING, ActivityStatus.CONFIRMED] });//solo devuelve activity si el status es pending  o confirmed
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
    status:activity.status,
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

async joinActivity(activityId: string, userId: string): Promise<{message:string;}> {
  const queryRunner = this.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          const activity = await queryRunner.manager.findOne(Activity, {
            where: { id: activityId,  status: In([ActivityStatus.PENDING, ActivityStatus.CONFIRMED])},
            relations: ["participants","creator"],
          });
          
          if (!activity) {
            throw new NotFoundException("Actividad inexistente o cancelada");
          }
          
          const user = await queryRunner.manager.findOne(Users, { where: { id: userId }, relations: ["participatedActivities"] });
          
          if (!user) {
            throw new NotFoundException("Usuario inexistente");
          }
          
      const isParticipant = activity.participants.some(p => p.id === user.id);
      if (isParticipant || activity.creator.id === user.id) {
        throw new BadRequestException("El usuario ya es participante en esta actividad");
      }
        
      user.participatedActivities.push(activity);
      activity.participants.push(user);
      if(activity.status === ActivityStatus.PENDING && activity.participants.length === 5){ //confirmamos la actividad
        activity.status = ActivityStatus.CONFIRMED
      }
      await queryRunner.manager.save(user);
      await queryRunner.manager.save(activity);
      
      await queryRunner.commitTransaction();

      return {
        message: "Te uniste a la actividad con éxito",
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

async cancellActivity(activityId: string, userId: string): Promise<{message:string;}> {
  let message = "";
  const queryRunner = this.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const activity = await queryRunner.manager.findOne(Activity, {
      where: { id: activityId},
      relations: ["creator","participants"],
    });
    
    if (!activity) {
      throw new NotFoundException("Actividad inexistente");
    }
    
    const user = await queryRunner.manager.findOne(Users, { where: { id: userId }, relations: ["participatedActivities"] });
    
    if (!user) {
      throw new NotFoundException("Usuario inexistente");
    }
    
    const isParticipant = activity.participants.some(p => p.id === user.id);
    if (isParticipant) {
      console.log("Participante")
      user.participatedActivities = user.participatedActivities.filter(act => act.id !== activity.id);
      activity.participants=activity.participants.filter(p => p.id === user.id);
      if(activity.status === ActivityStatus.CONFIRMED&& activity.participants.length < 5){ //si el nro de parcipante baja la actividad pasa a pendiente
        activity.status = ActivityStatus.PENDING 
      }
      await queryRunner.manager.save(activity);
      await queryRunner.manager.save(user);
      message = "Ya no eres participante de la actividad!"
    }else if(activity.creator.id === user.id){
      console.log("Creador")
      if(activity.status === ActivityStatus.CANCELLED) throw new BadRequestException('La actividad ya a sido cancelada')
      activity.status = ActivityStatus.CANCELLED;
      await queryRunner.manager.save(activity);
      message = "Actividad cancelada con exito!"
    } else {
      console.log("Burro")
      throw new BadRequestException('No participas de esta actividad o no eres el creador')
    }

    await queryRunner.commitTransaction();

    return {message}
    } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
    } finally {
    await queryRunner.release();
    }
 
  }
  
async getUserActivities(userId: string):Promise<{created:Activity[];joined:Activity[]}> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['participatedActivities', 'participatedActivities.category','participatedActivities.creator'],
    });
    user.participatedActivities = user.participatedActivities.filter(act => act.status !== ActivityStatus.CANCELLED )
    if (!user) {
      throw new NotFoundException('Usuario inexistente');
    }
    const createdActivities = await this.activityRepository.find({
      where: { creator: { id: userId } },
      relations: ['creator', 'category', 'participants'], 
    });
  const joinedActivities = user.participatedActivities;
  return {
    created: createdActivities,
    joined: joinedActivities,
  };
  }
}