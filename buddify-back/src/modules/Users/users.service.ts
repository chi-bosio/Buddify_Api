import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  register(newUser: CreateUserDto): Promise<{ message: string }> {
    return this.userRepository.register(newUser);
  }
  findByEmail(email:string){
    return this.userRepository.findByEmail(email);
  }
  findById(id: string) {
    return this.userRepository.findById(id);
  }
}
