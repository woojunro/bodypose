import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/users/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);

export const REST_ROLES_KEY = 'rest_roles';
export const RestRoles = (...roles: UserType[]) =>
  SetMetadata(REST_ROLES_KEY, roles);
