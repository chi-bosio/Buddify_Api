import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dtos/LoginUser.dto';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Credentials } from '../credentials/credentials.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dtos/CreateUser.dto';
import { UsersService } from '../users/users.service';
import { Users } from '../users/users.entity';
import { GoogleUserDto } from '../users/dtos/GoogleUserDto';
import { CompleteProfileDto } from '../Users/dtos/CompleteProfile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Credentials)
    private credentialsRepository: Repository<Credentials>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private usersService: UsersService,
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
      sub: user.id,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'usuario logueado',
      access_token: token
    };
  }

  async validateGoogleUser(googleUser: GoogleUserDto) {
 
    const existingUser = await this.usersRepository.findOne({ where: { email: googleUser.email } });

    console.log("Usuario encontrado:", existingUser ? "Sí" : "No");

    if (existingUser) {

      const isComplete = Boolean(existingUser.birthdate && existingUser.city && existingUser.country && existingUser.dni);
      
      console.log("Perfil completo:", isComplete); ///////////
      
      const userWithProfileComplete = { ...existingUser, profileComplete: isComplete };

      console.log("Usuario con profileComplete agregado:", userWithProfileComplete); /////////////

      return userWithProfileComplete;

    } else {
      const newUser = this.usersRepository.create({
        email: googleUser.email,
        name: googleUser.name,
        lastname: googleUser.lastname,
        username: googleUser.username,
        birthdate: "",       ////////////        CAMBIAR EL STRING
        city: "",         
        country: "",      
        dni: "",          
        password: "",     
        isPremium: false, 
        isAdmin: false,   
        credential: null, 
        activities: []    
      } as DeepPartial<Users>);

      await this.usersRepository.save(newUser);

      return { ...newUser, profileComplete: false };
    }
}
  
  async updateUserProfile(userId: string, completeUserDto: CompleteProfileDto) {
    console.log("USERRRR:", userId)
    const user = await this.usersRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
  
    user.birthdate = completeUserDto.birthdate || user.birthdate;
    user.city = completeUserDto.city || user.city;
    user.country = completeUserDto.country || user.country;
    user.dni = completeUserDto.dni || user.dni;
  
    await this.usersRepository.save(user);
  
    return user;
  }
  
}
