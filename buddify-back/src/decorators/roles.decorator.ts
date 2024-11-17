import { SetMetadata } from "@nestjs/common";
import { Role } from "../utils/Roles";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles)