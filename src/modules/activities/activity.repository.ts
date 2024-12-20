import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Activity } from './activity.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Between, Not } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Users } from '../users/users.entity';
import { EntityManager } from 'typeorm';
import { CreateActivityDto } from './dtos/create-activity.dto';
import { SearchActivitiesDto } from './dtos/search-activities.dto';
import { ActivityStatus } from './enums/activity-status.enum';
import * as moment from 'moment';
import { MailService } from 'modules/mail/mail.service';

@Injectable()
export class ActivityRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly mailService: MailService,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
  ): Promise<{ message: string }> {
    const userExist = await this.userRepository.findOne({
      where: { id: createActivityDto.creatorId },
    });
    if (!userExist) {
      throw new BadRequestException('Usuario inexistente');
    }

    if (userExist.isBanned) {
      throw new ForbiddenException('Usuario baneado');
    }
    ////////////////////////////////////////////////////////////

    const { count } = await this.getUserCreatedActivitiesCount(
      createActivityDto.creatorId,
    );

    if (!userExist.isPremium && count >= 3) {
      throw new BadRequestException(
        'Has alcanzado el límite de actividades creadas este mes',
      );
    }
    ///////////////////////////////////////////////////////////

    const categoryExist = await this.categoryRepository.findOne({
      where: { id: createActivityDto.categoryId },
    });
    if (!categoryExist) {
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
      category: categoryExist,
      participants: [],
    };

    await this.activityRepository.save(newActivity);
    await this.mailService.sendActivityCreatedEmail(
      userExist.email,
      userExist.name,
      {
        name: createActivityDto.name,
        date: new Date(createActivityDto.date),
        time: createActivityDto.time,
        place: createActivityDto.place,
      },
    );

    return { message: 'Actividad creada con exito' };
  }

  async searchActivities(
    query: SearchActivitiesDto,
  ): Promise<{ data: any[]; total: number }> {
    const {
      latitude,
      longitude,
      radius = 10,
      categoryId,
      userId,
      dateStart,
      dateEnd,
      page = 1,
      limit = 8,
    } = query;

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
      .where(haversineFormula + ' <= :radius', {
        latitude: latitudeNumber,
        longitude: longitudeNumber,
        radius: radiusNumber,
      });

    queryBuilder.andWhere('activity.creatorId != :userId', { userId });
    queryBuilder.andWhere(
      'activity.id NOT IN (SELECT "activityId" FROM user_activity WHERE "userId" = :userId)',
      { userId },
    );
    queryBuilder.andWhere('activity.status IN (:...statuses)', {
      statuses: [ActivityStatus.PENDING, ActivityStatus.CONFIRMED],
    }); //solo devuelve activity si el status es pending  o confirmed
    if (categoryId) {
      queryBuilder.andWhere('activity.category.id = :categoryId', {
        categoryId,
      });
    }

    if (dateStart && dateEnd) {
      queryBuilder.andWhere('activity.date BETWEEN :dateStart AND :dateEnd', {
        dateStart,
        dateEnd,
      });
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

    const data = activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      image: activity.image,
      date: activity.date,
      time: activity.time,
      place: activity.place,
      latitude: activity.latitude,
      longitude: activity.longitude,
      status: activity.status,
      creator: {
        name: activity.creator?.name || '',
        lastname: activity.creator?.lastname || '',
        avatar: activity.creator?.avatar || '',
        isPremium: activity.creator?.isPremium || '',
      },
      category: {
        id: activity.category?.id || '',
        name: activity.category?.name || '',
      },
    }));

    return { data, total };
  }

  async joinActivity(
    activityId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const activity = await queryRunner.manager.findOne(Activity, {
        where: {
          id: activityId,
          status: In([ActivityStatus.PENDING, ActivityStatus.CONFIRMED]),
        },
        relations: ['participants', 'creator'],
      });

      if (!activity) {
        throw new NotFoundException('Actividad inexistente o cancelada');
      }

      const user = await queryRunner.manager.findOne(Users, {
        where: { id: userId },
        relations: ['participatedActivities'],
      });

      if (!user) {
        throw new NotFoundException('Usuario inexistente');
      }
      if (user.isBanned) {
        throw new ForbiddenException('Usuario baneado');
      }

      const isParticipant = activity.participants.some((p) => p.id === user.id);
      if (isParticipant || activity.creator.id === user.id) {
        throw new BadRequestException(
          'El usuario ya es participante en esta actividad',
        );
      }
      ////////////////////////////////////////////////////////////
      if (!user.isPremium) {
        const startOfMonth = moment().startOf('month').toDate(); // Fecha de inicio del mes actual
        const endOfMonth = moment().endOf('month').toDate(); // Fecha de fin del mes actual

        const activitiesThisMonth = await queryRunner.manager.count(Activity, {
          where: {
            participants: { id: userId }, // Filtrar actividades con el usuario como participante
            date: Between(startOfMonth, endOfMonth), // Dentro del mes actual
            status: Not(In([ActivityStatus.SUCCESS, ActivityStatus.CANCELLED])), // Excluir actividades finalizadas o canceladas
          },
        });

        if (activitiesThisMonth >= 3) {
          throw new BadRequestException({
            message:
              'Los usuarios no Premium solo pueden unirse a 3 actividades por mes', // Mensaje para el front
            errorCode: 'LIMIT_REACHED', // Código único para identificar este error
          });
        }
      }
      ////////////////////////////////////////////////////////////

      user.participatedActivities.push(activity);
      activity.participants.push(user);
      if (
        activity.status === ActivityStatus.PENDING &&
        activity.participants.length === 5
      ) {
        //confirmamos la actividad
        activity.status = ActivityStatus.CONFIRMED;
      }
      await queryRunner.manager.save(user);
      await queryRunner.manager.save(activity);

      await this.mailService.sendJoinedActivityEmail(user.email, user.name, {
        name: activity.name,
        date: activity.date,
        time: activity.time,
        place: activity.place,
      });

      await queryRunner.commitTransaction();

      return {
        message: 'Te uniste a la actividad con éxito',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancellActivity(
    activityId: string,
    userId: string,
  ): Promise<{ message: string }> {
    let message = '';
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const activity = await queryRunner.manager.findOne(Activity, {
        where: { id: activityId, status: Not(In([ActivityStatus.CANCELLED,ActivityStatus.SUCCESS]))},
        relations: ['creator', 'participants'],
      });

      if (!activity) {
        throw new NotFoundException('Actividad inexistente ,o ya cancelada ,o ya finalizada');
      }

      const user = await queryRunner.manager.findOne(Users, {
        where: { id: userId },
        relations: ['participatedActivities'],
      });

      if (!user) {
        throw new NotFoundException('Usuario inexistente');
      }
      if (user.isBanned) {
        throw new ForbiddenException('Usuario baneado');
      }

      const isParticipant = activity.participants.some((p) => p.id === user.id);
      if (isParticipant) {
        user.participatedActivities = user.participatedActivities.filter(
          (act) => act.id !== activity.id,
        );
        activity.participants = activity.participants.filter(
          (p) => p.id === user.id,
        );

        if (
          activity.status === ActivityStatus.CONFIRMED &&
          activity.participants.length < 5
        ) {
          //si el nro de parcipante baja la actividad pasa a pendiente
          activity.status = ActivityStatus.PENDING;
        }

        await queryRunner.manager.save(activity);
        await queryRunner.manager.save(user);

        await this.mailService.sendCanceledParticipationEmail(
          user.email,
          user.name,
          {
            name: activity.name,
            date: activity.date,
            time: activity.time,
            place: activity.place,
          },
        );

        message = 'Ya no eres participante de la actividad!';
      } else if (activity.creator.id === user.id || user.isAdmin) {
        if (activity.status === ActivityStatus.CANCELLED)
          throw new BadRequestException('La actividad ya ha sido cancelada');

        activity.status = ActivityStatus.CANCELLED;
        await queryRunner.manager.save(activity);

        await this.mailService.sendActivityCanceledByCreatorEmail(
          user.email,
          user.name,
          {
            name: activity.name,
            date: activity.date,
            time: activity.time,
            place: activity.place,
          },
        );

        if (
          activity.participants.map((participant) =>
            this.mailService.sendActivityCanceledToParticipantsEmail(
              participant.email,
              participant.name,
              {
                name: activity.name,
                date: activity.date,
                time: activity.time,
                place: activity.place,
              },
            ),
          )
        )
          message = 'Actividad cancelada con exito!';
      } else {
        throw new BadRequestException(
          'No participas de esta actividad o no eres el creador',
        );
      }

      await queryRunner.commitTransaction();

      return { message };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserActivities(
    userId: string,
  ): Promise<{ created: Activity[]; joined: Activity[] }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'participatedActivities',
        'participatedActivities.category',
        'participatedActivities.creator',
      ],
    });
    user.participatedActivities = user.participatedActivities.filter(
      (act) => act.status !== ActivityStatus.CANCELLED,
    );
    if (!user) {
      throw new NotFoundException('Usuario inexistente');
    }
    if (user.isBanned) {
      throw new ForbiddenException('Usuario baneado');
    }
    const createdActivities = await this.activityRepository.find({
      where: { creator: { id: userId } },
      relations: ['creator', 'category', 'participants'],
    });
    const joinedActivities = user.participatedActivities;

    const activityStatusOrder: { [key in ActivityStatus]: number } = {
      [ActivityStatus.CONFIRMED]: 0,  
      [ActivityStatus.PENDING]: 1,    
      [ActivityStatus.SUCCESS]: 2,    
      [ActivityStatus.CANCELLED]: 3,  
    };

    createdActivities.sort((a, b) => {
      return activityStatusOrder[a.status] - activityStatusOrder[b.status];
    });
  
    joinedActivities.sort((a, b) => {
      return activityStatusOrder[a.status] - activityStatusOrder[b.status];
    });

    return {
      created: createdActivities,
      joined: joinedActivities,
    };
  }

  async getUserCreatedActivitiesCount(
    userId: string,
  ): Promise<{ count: number }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (user.isBanned) {
      throw new ForbiddenException('Usuario baneado');
    }

    let count = 0;

    if (user.isPremium) {
      count = await this.activityRepository.count({
        where: {
          creator: { id: userId },
        },
      });
    } else {
      const startOfMonth = moment().startOf('month').toDate();
      const endOfMonth = moment().endOf('month').toDate();

      count = await this.activityRepository.count({
        where: {
          creator: { id: userId },
          date: Between(startOfMonth, endOfMonth),
          status: Not(In([ActivityStatus.SUCCESS, ActivityStatus.CANCELLED])),
        },
      });
    }

    return { count };
  }

  async getTotalActivitiesByMonth(): Promise<{ name: string; total: number }[]> {
    return this.activityRepository
      .createQueryBuilder('activity')
      .select("TO_CHAR(activity.date, 'YYYY-MM')", 'name')
      .addSelect('COUNT(activity.id)', 'total')
      .groupBy("TO_CHAR(activity.date, 'YYYY-MM')")
      .orderBy("TO_CHAR(activity.date, 'YYYY-MM')", 'ASC')
      .getRawMany();
  }

  async getTotalActivitiesByCountry(): Promise<{ name: string; total: number }[]> {
    return this.activityRepository
      .createQueryBuilder('activity')
      .innerJoin('activity.creator', 'creator')
      .select('creator.country', 'name')
      .addSelect('COUNT(activity.id)', 'total')
      .groupBy('creator.country')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  async getTotalActivities(): Promise< number > {
    return await this.activityRepository.count();
  }

  async getTotalActivitiesSuccess(): Promise< number > {
    return await this.activityRepository.count({where:{status:ActivityStatus.SUCCESS}});
  }
  async getTotalActivitiesConfirmed(): Promise< number > {
    return await this.activityRepository.count({where:{status:ActivityStatus.CONFIRMED}});
  }
  async getTotalActivitiesPending(): Promise< number > {
    return await this.activityRepository.count({where:{status:ActivityStatus.PENDING}});
  }
  async getTotalActivitiesCancelled(): Promise< number > {
    return await this.activityRepository.count({where:{status:ActivityStatus.CANCELLED}});
  }
  async getActivities(): Promise< Activity[] > {
    return await this.activityRepository.find({relations:["creator","category"]});
  }
}
