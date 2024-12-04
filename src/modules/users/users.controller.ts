import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserPremiumStatusDto } from './dtos/change-is-premium.dto';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { Role } from 'utils/roles';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('premium-countries') 
  getPremiumCountries() {
    return this.userService.getPremiumCountries();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total-premium')
  async getTotalPremiumUsers() {
    return await this.userService.getTotalPremiumUsers();
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user);
  }
  @Patch(':id/premium-status')
  async updatePremiumStatus(
    @Param('id') id: string,
    @Body() updatePremiumStatusDto: UpdateUserPremiumStatusDto,
  ) {
    const result = await this.userService.updateUserPremiumStatus(
      id,
      updatePremiumStatusDto,
    );

    if (result.success) {
      return result;
    } else {
      throw new Error(result.message);
    }
  }

  @Patch(':id/ban')
  banUser(@Param('id') userId: string) {
    return this.userService.banUser(userId);
  }

  @Patch(':id/unban')
  unbanUser(@Param('id') userId: string) {
    return this.userService.unbanUser(userId);
  }
}
