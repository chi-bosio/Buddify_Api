import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { UsersRepository } from '../users/users.repository';
import { ChangePswDto } from '../users/dtos/ChangePsw.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Credentials)
    private credentialsRepository: Repository<Credentials>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
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
      name: user.name,
      sub: user.id,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'usuario logueado',
      access_token: token,
    };
  }

  async validateGoogleUser(googleUser: GoogleUserDto) {
 
    const existingUser = await this.usersRepository.findOne({ where: { email: googleUser.email } });

    if (existingUser) {

      const isComplete = Boolean(existingUser.birthdate && existingUser.city && existingUser.country && existingUser.dni);
      
      const userWithProfileComplete = { ...existingUser, profileComplete: isComplete };

      return userWithProfileComplete;

    } else {
      const newUser = this.usersRepository.create({
        email: googleUser.email,
        name: googleUser.name,
        lastname: googleUser.lastname,
        username: googleUser.username,
        birthdate: "",
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
      console.log(error)
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
