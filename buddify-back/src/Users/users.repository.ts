import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./users.entity";
import { Repository } from "typeorm";

@Injectable()

export class UsersRepository {

    constructor(
      @InjectRepository(Users)
      private readonly usersRepository: Repository<Users>

    ) {}}
