import {
  Args,
  Context,
  GqlExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { User, UserType } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import {
  EmailLoginInput,
  LoginOutput,
  SocialLoginInput,
} from './dtos/login.dto';
import { LogoutInput, LogoutOutput } from './dtos/logout.dto';
import { Roles } from './roles.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Public
  @Mutation(returns => LoginOutput)
  emailLogin(
    @Args('input') input: EmailLoginInput,
    @Context() context: GqlExecutionContext,
  ): Promise<LoginOutput> {
    return this.authService.emailLogin(input, context);
  }

  // Public
  @Mutation(returns => LoginOutput)
  socialLogin(
    @Args('input') input: SocialLoginInput,
    @Context() context: GqlExecutionContext,
  ): Promise<LoginOutput> {
    return this.authService.socialLogin(input, context);
  }

  @Roles(UserType.USER, UserType.STUDIO, UserType.ADMIN)
  @Mutation(returns => LogoutOutput)
  logout(
    @CurrentUser() user: User,
    @Args('input') input: LogoutInput,
    @Context() context: GqlExecutionContext,
  ): Promise<LogoutOutput> {
    return this.authService.logout(user, input, context);
  }
}
