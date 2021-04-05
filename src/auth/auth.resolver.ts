import {
  Args,
  Context,
  GqlExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  EmailLoginInput,
  LoginOutput,
  SocialLoginInput,
} from './dtos/login.dto';

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
}
