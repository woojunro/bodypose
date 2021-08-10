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
  AdminUpdateProfileInput,
  CreateProfileInput,
  CreateProfileOutput,
  DeleteProfileImageInput,
  GetProfileInput,
  GetProfileOutput,
  UpdateProfileInput,
  UpdateProfileOutput,
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
import { CoreOutput } from 'src/common/dtos/output.dto';
import { LockUserInput, LockUserOutput } from './dtos/lock-user.dto';
import { UpdateEmailInput, UpdateEmailOutput } from './dtos/update-email.dto';
import { GetUserInfoInput, GetUserInfoOutput } from './dtos/get-user-info.dto';
import { Partner } from './entities/partner.entity';
import {
  CreatePartnerInput,
  CreatePartnerOutput,
} from './dtos/create-partner.dto';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => GetProfileOutput)
  @Roles(UserType.USER, UserType.STUDIO, UserType.ADMIN)
  userProfile(
    @CurrentUser() user: User,
    @Args('input') input: GetProfileInput,
  ): Promise<GetProfileOutput> {
    return this.usersService.getProfile(user, input);
  }

  @Query(returns => GetUserInfoOutput)
  @Roles(UserType.USER, UserType.STUDIO, UserType.ADMIN)
  userInfo(
    @CurrentUser() user: User,
    @Args('input') input: GetUserInfoInput,
  ): Promise<GetUserInfoOutput> {
    return this.usersService.getUserInfo(user, input);
  }

  // Public
  @Mutation(returns => CreateUserWithEmailOutput)
  createUserWithEmail(
    @Args('input') input: CreateUserWithEmailInput,
    @Context() context: GqlExecutionContext,
  ): Promise<CreateUserWithEmailOutput> {
    return this.usersService.createUserWithEmail(input);
  }

  @Mutation(returns => CreateProfileOutput)
  @Roles(UserType.USER)
  createMyProfile(
    @CurrentUser() user: User,
    @Args('input') input: CreateProfileInput,
  ): Promise<CreateProfileOutput> {
    return this.usersService.createMyProfile(user, input);
  }

  @Mutation(returns => UpdateProfileOutput)
  @Roles(UserType.USER)
  updateMyProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    return this.usersService.updateMyProfile(user, input);
  }

  @Mutation(returns => UpdateProfileOutput)
  @Roles(UserType.ADMIN)
  updateProfile(
    @Args('input') input: AdminUpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    return this.usersService.updateProfile(input);
  }

  @Mutation(returns => UpdateProfileOutput)
  @Roles(UserType.USER, UserType.ADMIN)
  deleteProfileImage(
    @CurrentUser() user: User,
    @Args('input') input: DeleteProfileImageInput,
  ) {
    return this.usersService.deleteProfileImage(user, input);
  }

  @Mutation(returns => DeleteUserOutput)
  @Roles(UserType.USER)
  deleteMyAccount(@CurrentUser() user: User): Promise<DeleteUserOutput> {
    return this.usersService.deleteUserById(user.id);
  }

  @Roles(UserType.USER, UserType.ADMIN, UserType.STUDIO)
  @Mutation(returns => UpdateEmailOutput)
  updateEmail(
    @Args('input') input: UpdateEmailInput,
    @CurrentUser() user: User,
  ): Promise<UpdateEmailOutput> {
    return this.usersService.updateEmail(input, user);
  }

  // Public
  @Mutation(returns => VerifyUserOutput)
  verifyUser(@Args('input') input: VerifyUserInput): Promise<VerifyUserOutput> {
    return this.usersService.verifyUser(input);
  }

  @Mutation(returns => CoreOutput)
  resendVerificationMail(@CurrentUser() user: User): Promise<CoreOutput> {
    return this.usersService.resendVerificationMail(user);
  }

  // Public
  @Mutation(returns => RequestPasswordResetOutput)
  requestPasswordReset(
    @Args('input') input: RequestPasswordResetInput,
  ): Promise<RequestPasswordResetOutput> {
    return this.usersService.requestPasswordReset(input);
  }

  // Public
  @Mutation(returns => UpdatePasswordOutput)
  updatePassword(
    @Args('input') input: UpdatePasswordInput,
  ): Promise<UpdatePasswordOutput> {
    return this.usersService.updatePassword(input);
  }

  @Mutation(returns => LockUserOutput)
  @Roles(UserType.ADMIN)
  lockUser(@Args('input') input: LockUserInput): Promise<LockUserOutput> {
    return this.usersService.lockUser(input);
  }
}

@Resolver(of => Partner)
export class PartnersResolver {
  constructor(private readonly usersService: UsersService) {}

  // Public
  @Mutation(returns => CreatePartnerOutput)
  createPartner(
    @Args('input') input: CreatePartnerInput,
  ): Promise<CreatePartnerOutput> {
    return this.usersService.createPartner(input);
  }
}
