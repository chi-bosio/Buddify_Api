import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
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
}
