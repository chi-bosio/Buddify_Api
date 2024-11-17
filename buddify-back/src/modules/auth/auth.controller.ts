import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../Users/dtos/CreateUser.dto';
import { UsersService } from '../Users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../Users/dtos/LoginUser.dto';
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
    res.redirect(`${process.env.URL_FRONT}?token=${response.token}`);
  }
}
