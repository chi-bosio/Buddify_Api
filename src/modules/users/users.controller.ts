import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserPremiumStatusDto } from './dtos/change-is-premium.dto';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Role } from 'utils/roles';
import { Roles } from 'decorators/roles.decorator';

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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total')
  async getTotalUsers() {
    return this.userService.getTotalUsers();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('users-countries')
  getUsersCountries() {
    return this.userService.getUsersCountries();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total-banned')
  async getTotalBannedUsers() {
    return await this.userService.getTotalBannedUsers();
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
  @UseGuards(AuthGuard)
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user);
  }
  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/ban')
  banUser(@Param('id') userId: string) {
    return this.userService.banUser(userId);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/unban')
  unbanUser(@Param('id') userId: string) {
    return this.userService.unbanUser(userId);
  }

  @Patch(':id/promote')
  changeToAdmin(@Param('id') userId: string) {
    return this.userService.changeToAdmin(userId);
  }

  @Patch(':id/demote')
  changeToUser(@Param('id') userId: string) {
    return this.userService.changeToUser(userId);
  }
}
