import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const REST_ROLES_KEY = 'rest_roles';
export const RestRoles = (...roles: Role[]) =>
  SetMetadata(REST_ROLES_KEY, roles);
