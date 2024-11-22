import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dtos/LoginUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Credentials } from '../credentials/credentials.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dtos/CreateUser.dto';
import { UsersService } from '../users/users.service';
import { Users } from '../users/users.entity';
import { UsersRepository } from '../users/users.repository';
import { ChangePswDto } from '../users/dtos/ChangePsw.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Credentials)
    private credentialsRepository: Repository<Credentials>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectRepository(Users)
    private usersRepository: UsersRepository,
  ) {}

  async login(loginUserDto: string | LoginUserDto) {
    if (typeof loginUserDto === 'string') {
      const user = await this.usersService.findById(String(loginUserDto));

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const payload = {
        username: user.name,
        sub: user.id,
        isPremium: user.isPremium,
        isAdmin: user.isAdmin,
      };

      const access_token = this.jwtService.sign(payload);

      return {
        message: 'Usuario autenticado con OAuth',
        access_token,
      };
    }
    const { username, password } = loginUserDto;

    const credentials = await this.credentialsRepository.findOne({
      where: { username },
      relations: ['user'],
    });

    if (!credentials) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    const validPassword = await bcrypt.compare(password, credentials.password);

    if (!validPassword) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const user = credentials.user;

    const payload = {
      name: user.name,
      sub: user.id,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'usuario logueado',
      access_token: token,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.usersService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.usersService.register(googleUser);
  }

  async generateResetToken(email: string): Promise<string> {
    const payload = { email };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    return resetToken;
  }

  async validateResetToken(token: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded.email;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const email = await this.validateResetToken(token);

    await this.usersService.resetPassword(email, newPassword);
  }

  async changePassword(
    userId: string,
    changePswDto: ChangePswDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePswDto;

    if (newPassword !== confirmPassword) {
      throw new UnauthorizedException('Las contraseñas no coinciden');
    }

    const credentials = await this.credentialsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!credentials) {
      throw new UnauthorizedException('Credenciales no encontradas');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      credentials.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    credentials.password = hashedPassword;
    await this.credentialsRepository.save(credentials);

    return { message: 'Contraseña actualizada con éxito' };
  }
}
