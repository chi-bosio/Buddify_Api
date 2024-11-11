import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../Users/dtos/CreateUser.dto';
import { UsersService } from '../Users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService:UsersService){}
  @Post('singin')
  register(@Body() newUser: CreateUserDto): Promise<{ message: string }> {
    return this.userService.register(newUser);
  }
}
