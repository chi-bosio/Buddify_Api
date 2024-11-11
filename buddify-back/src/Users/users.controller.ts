import { Body, Controller, Post} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUserDto.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService:UsersService){}
    @Post()
    register(@Body() newUser:CreateUserDto):Promise<{message:string;}>{
        return this.userService.register(newUser);
    }
}
