import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/CreateUser.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dtos/LoginUser.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
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
    const response = await this.authService.login(req.user.id);
    res.redirect(`${process.env.URL_FRONT}?token=${response.access_token}`);
  }

  @Post('generate-reset-token')
  async generateResetPassword(@Body('email') email: string) {
    const token = await this.authService.generateResetToken(email);
    return { token };
  }

  @Patch('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Contraseña actualizada con éxito' };
  }
}
