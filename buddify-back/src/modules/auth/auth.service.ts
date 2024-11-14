import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../Users/dtos/LoginUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Credentials } from '../../Credentials/credentials.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Credentials)
    private credentialsRepository: Repository<Credentials>,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
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
      token,
    };
  }
}
