import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/CreateUser.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dtos/LoginUser.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { JwtService } from '@nestjs/jwt';
import { CompleteProfileDto } from '../Users/dtos/CompleteProfile.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}
  @Post('signup')
  register(@Body() newUser: CreateUserDto): Promise<{ message: string }> {
    return this.userService.register(newUser);
  }

  @Post('signin')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  googleLogin() {}
  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  async googleCallback(@Req() req, @Res() res) {

    const user = req.user;
  
    console.log('Google user:', req.user);//////////

    if (!user) {
      throw new UnauthorizedException('No se pudo autenticar con Google');
    }
  
    const profileComplete = user.profileComplete;
  
    const payload = {
      sub: user.id,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
    };
  
    const token = this.jwtService.sign(payload);
  
    console.log(token)///////////

    res.redirect(
      `${process.env.URL_FRONT}?token=${token}&profileComplete=${profileComplete}`
    );
  }
  
  @UseGuards(AuthGuard)
  @Put('/completeprofile')
async completeProfile(@Body() completeUserDto: CompleteProfileDto, @Req() req, @Res() res) {
  console.log("Solicitud recibida en /auth/completeprofile:", completeUserDto);
  console.log("Request user:", req.user);

  const userId = req.user.sub;

  console.log('User ID:', userId);/////////
 
  if (!userId) {
    return res.status(400).json({
      message: 'No se pudo identificar al usuario',
    });
  }

  const updatedUser = await this.authService.updateUserProfile(userId, completeUserDto);

  return res.status(200).json({
    message: 'Perfil actualizado con éxito',
    user: updatedUser,
  });
}

}
