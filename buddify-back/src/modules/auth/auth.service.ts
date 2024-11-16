import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../Users/dtos/LoginUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Credentials } from '../../Credentials/credentials.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../Users/dtos/CreateUser.dto';
import { UsersService } from '../Users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Credentials)
    private credentialsRepository: Repository<Credentials>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(loginUserDto: number | LoginUserDto) {
      if (typeof loginUserDto === 'number') {
        const user = await this.usersService.findById(String(loginUserDto));
    
        if (!user) {
          throw new UnauthorizedException('Usuario no encontrado');
        }
    
        const payload = {
          sub: user.id,
          isPremium: user.isPremium,
          isAdmin: user.isAdmin,
        };
    
        const token = this.jwtService.sign(payload);
    
        return {
          message: 'Usuario autenticado con OAuth',
          token,
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
      username: credentials.username,
      sub: user.id,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'usuario logueado',
      access_token: token
    };
  }

  async validateGoogleUser(googleUser:CreateUserDto){
    const user = await this.usersService.findByEmail(googleUser.email);
    if(user) return user;
    return await this.usersService.register(googleUser);
  }
}
