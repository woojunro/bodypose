import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/users/entities/user.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
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
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
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
      const userRole: Role = this.getRequest(context).user.role;
      return requiredRoles.includes(userRole);
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
