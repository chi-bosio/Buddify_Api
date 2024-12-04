import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserPremiumStatusDto } from './dtos/change-is-premium.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  getUsers() {
    return this.userRepository.getUsers();
  }
  register(newUser: CreateUserDto): Promise<{ message: string }> {
    return this.userRepository.register(newUser);
  }

  findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  findById(id: string) {
    return this.userRepository.findById(id);
  }

  getUserById(id: string) {
    return this.userRepository.getUserById(id);
  }

  resetPassword(email: string, newPassword: string) {
    return this.userRepository.resetPassword(email, newPassword);
  }
  updateUser(id: string, user: Partial<Users>) {
    return this.userRepository.updateUser(id, user);
  }

  updateUserPremiumStatus(
    id: string,
    updatePremiumStatusDto: UpdateUserPremiumStatusDto,
  ) {
    return this.userRepository.updateUserPremiumStatus(
      id,
      updatePremiumStatusDto,
    );
  }
  getPremiumCountries() {
    return this.userRepository.getPremiumCountries();
  }

  getTotalPremiumUsers(): Promise<number> {
    return this.userRepository.getTotalPremiumUsers();
  }
  banUser(userId: string) {
    return this.userRepository.banUser(userId);
  }

  unbanUser(userId: string) {
    return this.userRepository.unbanUser(userId);
  }

  getTotalUsers() {
    return this.userRepository.getTotalUsers();
  }

  getUsersCountries() {
    return this.userRepository.getUsersCountries();
  }

  getTotalBannedUsers(): Promise<number> {
    return this.userRepository.getTotalBannedUsers();
  }

  changeToAdmin(userId: string) {
    return this.userRepository.changeToAdmin(userId);
  }
  changeToUser(userId: string) {
    return this.userRepository.changeToUser(userId);
  }
}
