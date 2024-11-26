import { SetMetadata } from "@nestjs/common";
import { Role } from "../utils/roles";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles)