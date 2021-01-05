import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import {
  CreateUserWithEmailInput,
  CreateUserWithEmailOutput,
  CreateOrLoginUserWithOAuthInput,
  CreateOrLoginUserWithOAuthOutput,
} from './dtos/create-user.dto';
import { DeleteUserOutput } from './dtos/delete-user.dto';
import {
  GetMyProfileOutput,
  GetMyHeartStudiosOutput,
} from './dtos/get-user.dto';
import {
  UpdateUserProfileInput,
  UpdateUserProfileOutput,
} from './dtos/update-user.dto';
import { VerifyUserInput, VerifyUserOutput } from './dtos/verify-user.dto';
import { Role, User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => GetMyProfileOutput)
  @Roles(Role.USER)
  myProfile(@CurrentUser() user: User): Promise<GetMyProfileOutput> {
    return this.usersService.getUserProfileById(user.id);
  }

  @Query(returns => GetMyHeartStudiosOutput)
  @Roles(Role.USER)
  myHeartStudios(@CurrentUser() user: User): Promise<GetMyHeartStudiosOutput> {
    return this.usersService.getMyHeartStudios(user);
  }

  // Public
  @Mutation(returns => CreateUserWithEmailOutput)
  createUserWithEmail(
    @Args('input') input: CreateUserWithEmailInput,
  ): Promise<CreateUserWithEmailOutput> {
    return this.usersService.createUserWithEmail(input);
  }

  // Public
  @Mutation(returns => CreateOrLoginUserWithOAuthOutput)
  createOrLoginUserWithOAuth(
    @Args('input') input: CreateOrLoginUserWithOAuthInput,
  ): Promise<CreateOrLoginUserWithOAuthOutput> {
    return this.usersService.createOrLoginUserWithOAuth(input);
  }

  @Mutation(returns => UpdateUserProfileOutput)
  @Roles(Role.USER)
  updateMyProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<UpdateUserProfileOutput> {
    return this.usersService.updateUserProfileById(user.id, input);
  }

  @Mutation(returns => DeleteUserOutput)
  @Roles(Role.USER)
  deleteMyAccount(@CurrentUser() user: User): Promise<DeleteUserOutput> {
    return this.usersService.deleteUserById(user.id);
  }

  // Public
  @Mutation(returns => VerifyUserOutput)
  verifyUser(@Args('input') input: VerifyUserInput): Promise<VerifyUserOutput> {
    return this.usersService.verifyUser(input.code);
  }
}
