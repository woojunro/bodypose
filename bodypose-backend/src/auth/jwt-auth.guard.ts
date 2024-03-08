import { ContextType, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from 'src/users/entities/user.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql')
      return GqlExecutionContext.create(context).getContext().req;
    return context.switchToHttp().getRequest();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isTokenValid: boolean;
    try {
      isTokenValid = (await super.canActivate(context)) as boolean;
    } catch (e) {
      // super.canActivate throws an error
      // if authorization header does not exist
      isTokenValid = false;
    }
    // Now req.user is set if the token is valid
    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
        ROLES_KEY,
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
      const userRole: UserType = this.getRequest(context).user.type;
      return requiredRoles.includes(userRole);
    } catch (e) {
      return false;
    }
  }
}
