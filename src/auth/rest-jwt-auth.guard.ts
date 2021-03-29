import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from 'src/users/entities/user.entity';
import { REST_ROLES_KEY } from './roles.decorator';

@Injectable()
export class RestJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isTokenValid: boolean;
    try {
      isTokenValid = (await super.canActivate(context)) ? true : false;
    } catch (e) {
      // super.canActivate throws an error
      // if authorization header does not exist
      isTokenValid = false;
    }
    // Now req.user is set if the token is valid
    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
        REST_ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      // Public
      if (!requiredRoles) {
        return true;
      }
      // Private
      // Invalid token
      if (!isTokenValid) {
        return false;
      }
      // Valid token, check role
      const { user } = context.switchToHttp().getRequest();
      return requiredRoles.includes(user.role);
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
