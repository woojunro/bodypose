import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginWithEmailInput, LoginOutput } from './dtos/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Public
  @Mutation(returns => LoginOutput)
  loginWithEmail(
    @Args('input') input: LoginWithEmailInput,
  ): Promise<LoginOutput> {
    return this.authService.loginWithEmail(input);
  }
}
