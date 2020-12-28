import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserWithEmailInput,
  CreateUserWithEmailOutput,
} from './dtos/create-user.dto';
import { UserInput, UserOutput } from './dtos/user.dto';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => UserOutput)
  user(@Args('input') input: UserInput): Promise<UserOutput> {
    return this.usersService.getUserById(input);
  }

  @Mutation(returns => CreateUserWithEmailOutput)
  createUserWithEmail(
    @Args('input') input: CreateUserWithEmailInput,
  ): Promise<CreateUserWithEmailOutput> {
    return this.usersService.createUserWithEmail(input);
  }
}
