import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginWithEmailInput, LoginWithEmailOutput } from './dtos/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => LoginWithEmailOutput)
  loginWithEmail(
    @Args('input') input: LoginWithEmailInput,
  ): Promise<LoginWithEmailOutput> {
    return this.authService.loginWithEmail(input);
  }
}
