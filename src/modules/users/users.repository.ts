import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { EntityManager, Repository } from 'typeorm';
import { Credentials } from '../credentials/credentials.entity';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { capitalizeWords } from 'utils/capitalizeWords';
import { UpdateUserPremiumStatusDto } from './dtos/change-is-premium.dto';

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

  async getUsers() {
    const users = await this.usersRepository.find();
    if (!Array.isArray(users)) {
      throw new BadRequestException(
        'La respuesta no es un arreglo de usuarios',
      );
    }
    return users;
  }

  async findById(id: string): Promise<Users> {
    return await this.usersRepository.findOne({ where: { id } });
  }

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
      console.log(error);
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

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async getUserById(id: string) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.isThirdParty) {
      throw new UnauthorizedException(
        'Los usuarios autenticados con terceros no pueden restablecer su contraseña.',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const credentials = await this.credentialsRepository.findOne({
      where: { user: user },
    });
    if (!credentials) {
      throw new UnauthorizedException('Credenciales no encontradas');
    }

    credentials.password = hashedPassword;
    await this.credentialsRepository.save(credentials);
  }

  async updateUser(id: string, user: Partial<Users>): Promise<Users> {
    const userExists = await this.usersRepository.findOne({ where: { id } });
    if (!userExists) {
      throw new BadRequestException('No existe el usuario');
    }
    if (userExists.isBanned) {
      throw new ForbiddenException('Usuario baneado');
    }
    await this.usersRepository.update(id, user);
    return userExists;
  }

  async updateUserPremiumStatus(
    id: string,
    updatePremiumStatusDto: UpdateUserPremiumStatusDto,
  ): Promise<{ success: boolean; message: string; user: Users }> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.isPremium = updatePremiumStatusDto.isPremium;

    const updatedUser = await this.usersRepository.save(user);
    if(updatePremiumStatusDto.isPremium){
      await this.mailService.sendPremiumNotification(user.email,user.name)
    }

    return {
      success: true,
      message: 'Estado de Premium actualizado correctamente',
      user: updatedUser,
    };
  }
  async getPremiumCountries() {
    const countries = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.country')
      .addSelect('COUNT(user.id)', 'premiumCount')
      .where('user.isPremium = :isPremium', { isPremium: true })
      .groupBy('user.country')
      .getRawMany();
    return countries.map((country) => ({
      name: country.user_country,
      total: Number(country.premiumCount),
    }));
  }

  async getTotalPremiumUsers(): Promise<number> {
    const count = await this.usersRepository.count({
      where: { isPremium: true },
    });
    return count;
  }
  async banUser(userId: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    user.isBanned = true;
    user.bannedAt = new Date();
    await this.usersRepository.save(user);
    await this.mailService.sendBanNotification(user.email, user.name);
    return user;
  }

  async unbanUser(userId: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    user.isBanned = false;
    user.bannedAt = null;

    return await this.usersRepository.save(user);
  }
  async getTotalUsers(): Promise<number> {
    return await this.usersRepository.count();
  }

  async getUsersCountries() {
    const countries = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.country')
      .addSelect('COUNT(user.id)', 'premiumCount')
      .groupBy('user.country')
      .getRawMany();
    return countries.map((country) => ({
      name: country.user_country,
      total: Number(country.premiumCount),
    }));
  }

  async getTotalBannedUsers(): Promise<number> {
    return await this.usersRepository.count({ where: { isBanned: true } });
  }

  async changeToAdmin(userId: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    user.isAdmin = true;
    return await this.usersRepository.save(user);
  }

  async changeToUser(userId: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    user.isAdmin = false;
    return await this.usersRepository.save(user);
  }
}
