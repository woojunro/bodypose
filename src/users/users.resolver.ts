import {
  Args,
  Context,
  GqlExecutionContext,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
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
  UpdateMyProfileInput,
  UpdateMyProfileOutput,
} from './dtos/user-profile.dto';
import {
  RequestPasswordResetInput,
  RequestPasswordResetOutput,
  UpdatePasswordInput,
  UpdatePasswordOutput,
} from './dtos/update-password.dto';
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
    @Context() context: GqlExecutionContext,
  ): Promise<CreateUserWithEmailOutput> {
    return this.usersService.createUserWithEmail(input, context);
  }

  @Mutation(returns => CreateMyProfileOutput)
  @Roles(UserType.USER)
  createMyProfile(
    @CurrentUser() user: User,
    @Args('input') input: CreateMyProfileInput,
  ): Promise<CreateMyProfileOutput> {
    return this.usersService.createMyProfile(user, input);
  }

  @Mutation(returns => UpdateMyProfileOutput)
  @Roles(UserType.USER)
  updateMyProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateMyProfileInput,
  ): Promise<UpdateMyProfileOutput> {
    return this.usersService.updateMyProfile(user, input);
  }

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
}
