import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { EmailLoginInput, LoginOutput } from './dtos/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Public
  @Mutation(returns => LoginOutput)
  emailLogin(@Args('input') input: EmailLoginInput): Promise<LoginOutput> {
    return this.authService.emailLogin(input);
  }
}
