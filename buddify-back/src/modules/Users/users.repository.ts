import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { Credentials } from '../../Credentials/credentials.entity';
import * as bcrypt from 'bcrypt';
import { capitalizeWords } from 'src/utils/capitalizeWords';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    private readonly manager: EntityManager,
    private readonly mailService: MailService,
  ) {}
  async register(newUser: CreateUserDto): Promise<{ message: string }> {
    const queryRunner = this.manager.connection.createQueryRunner();
    const entityManager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (
        await this.usersRepository.findOne({ where: { email: newUser.email } })
      )
        throw new BadRequestException('El email ya esta registrado');
      if (
        await this.credentialsRepository.findOne({
          where: { username: newUser.username },
        })
      )
        throw new BadRequestException('El username ya esta registrado');

      const cityFormatted = capitalizeWords(newUser.city);
      const countryFormatted = capitalizeWords(newUser.country);

      const userCreate = await entityManager.save(Users, {
        name: newUser.name,
        lastname: newUser.lastname,
        birthdate: newUser.birthdate,
        city: cityFormatted,
        country: countryFormatted,
        dni: newUser.dni,
        email: newUser.email,
      });

      const passwordHash = await bcrypt.hash(newUser.password, 10);

      await entityManager.save(Credentials, {
        password: passwordHash,
        username: newUser.username,
        user: userCreate,
      });

      await this.mailService.sendWelcomeEmail(
        userCreate.email,
        userCreate.name,
      );

      await queryRunner.commitTransaction();
      return { message: 'Se registro con exito al usuario' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const status = error.response.statusCode
        ? error.response.statusCode
        : 500;
      const message = error.response.message
        ? error.response.message
        : 'Error inesperado';
      throw new HttpException({ status, message }, status);
    } finally {
      await queryRunner.release();
    }
  }
}
