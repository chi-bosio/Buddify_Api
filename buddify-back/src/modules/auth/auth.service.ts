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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Credentials)
    private credentialsRepository: Repository<Credentials>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
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
    return this.jwtService.sign(payload, { expiresIn: '1h' });
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
}
