import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import {
  CreateUserWithEmailInput,
  CreateUserWithEmailOutput,
} from './dtos/create-user.dto';
import { DeleteUserOutput } from './dtos/delete-user.dto';
import {
  CreateMyProfileInput,
  CreateMyProfileOutput,
  GetMyProfileOutput,
} from './dtos/user-profile.dto';
import {
  RequestPasswordResetInput,
  RequestPasswordResetOutput,
  UpdatePasswordInput,
  UpdatePasswordOutput,
} from './dtos/update-password.dto';
import {
  UpdateNicknameInput,
  UpdateNicknameOutput,
} from './dtos/update-user.dto';
import { VerifyUserInput, VerifyUserOutput } from './dtos/verify-user.dto';
import { UserType, User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => GetMyProfileOutput)
  @Roles(UserType.USER)
  myProfile(@CurrentUser() user: User): Promise<GetMyProfileOutput> {
    return this.usersService.getMyProfile(user);
  }

  // Public
  @Mutation(returns => CreateUserWithEmailOutput)
  createUserWithEmail(
    @Args('input') input: CreateUserWithEmailInput,
  ): Promise<CreateUserWithEmailOutput> {
    return this.usersService.createUserWithEmail(input);
  }

  @Mutation(returns => CreateMyProfileOutput)
  @Roles(UserType.USER)
  createMyProfile(
    @CurrentUser() user: User,
    @Args('input') input: CreateMyProfileInput,
  ): Promise<CreateMyProfileOutput> {
    return this.usersService.createMyProfile(user, input);
  }

  /* TBD
  @Mutation(returns => UpdateUserProfileOutput)
  @Roles(Role.USER)
  updateMyProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<UpdateUserProfileOutput> {
    return this.usersService.updateUserProfileById(user.id, input);
  }
  */

  @Mutation(returns => DeleteUserOutput)
  @Roles(UserType.USER)
  deleteMyAccount(@CurrentUser() user: User): Promise<DeleteUserOutput> {
    return this.usersService.deleteUserById(user.id);
  }

  // Public
  @Mutation(returns => VerifyUserOutput)
  verifyUser(@Args('input') input: VerifyUserInput): Promise<VerifyUserOutput> {
    return this.usersService.verifyUser(input.code);
  }

  // Public
  @Mutation(returns => RequestPasswordResetOutput)
  requestPasswordReset(
    @CurrentUser() user: User,
    @Args('input') input: RequestPasswordResetInput,
  ): Promise<RequestPasswordResetOutput> {
    return this.usersService.requestPasswordReset(user, input);
  }

  // Public
  @Mutation(returns => UpdatePasswordOutput)
  updatePassword(
    @Args('input') input: UpdatePasswordInput,
  ): Promise<UpdatePasswordOutput> {
    return this.usersService.updatePassword(input);
  }

  @Roles(UserType.USER)
  @Mutation(returns => UpdateNicknameOutput)
  updateNickname(
    @CurrentUser() user: User,
    @Args('input') input: UpdateNicknameInput,
  ): Promise<UpdateNicknameOutput> {
    return this.usersService.updateNickname(user, input);
  }
}
