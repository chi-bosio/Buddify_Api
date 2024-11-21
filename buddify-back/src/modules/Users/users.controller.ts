import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user);
  }
}
