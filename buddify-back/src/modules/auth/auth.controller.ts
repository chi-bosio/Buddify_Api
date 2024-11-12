import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../Users/dtos/CreateUser.dto';
import { UsersService } from '../Users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../Users/dtos/LoginUser.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService:UsersService,
      private readonly authService: AuthService
    ){}
  @Post('signup')
  register(@Body() newUser: CreateUserDto): Promise<{ message: string }> {
    return this.userService.register(newUser);
  }

  @Post('signin')
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
    }
}
