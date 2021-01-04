import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateUserWithEmailInput,
  CreateUserWithEmailOutput,
  CreateOrLoginUserWithOAuthInput,
  CreateOrLoginUserWithOAuthOutput,
} from './dtos/create-user.dto';
import { DeleteUserOutput } from './dtos/delete-user.dto';
import {
  GetMyProfileOutput,
  ReadMyHeartStudiosOutput,
} from './dtos/get-my-profile.dto';
import {
  UpdateUserProfileInput,
  UpdateUserProfileOutput,
} from './dtos/update-user.dto';
import { VerifyUserInput, VerifyUserOutput } from './dtos/verify-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => GetMyProfileOutput)
  @UseGuards(JwtAuthGuard)
  getMyProfile(@CurrentUser() user: User): Promise<GetMyProfileOutput> {
    return this.usersService.getUserProfileById(user.id);
  }

  @Query(returns => ReadMyHeartStudiosOutput)
  @UseGuards(JwtAuthGuard)
  myHeartStudios(@CurrentUser() user: User): Promise<ReadMyHeartStudiosOutput> {
    return this.usersService.readMyHeartStudios(user);
  }

  @Mutation(returns => CreateUserWithEmailOutput)
  createUserWithEmail(
    @Args('input') input: CreateUserWithEmailInput,
  ): Promise<CreateUserWithEmailOutput> {
    return this.usersService.createUserWithEmail(input);
  }

  @Mutation(returns => CreateOrLoginUserWithOAuthOutput)
  createOrLoginUserWithOAuth(
    @Args('input') input: CreateOrLoginUserWithOAuthInput,
  ): Promise<CreateOrLoginUserWithOAuthOutput> {
    return this.usersService.createOrLoginUserWithOAuth(input);
  }

  @Mutation(returns => UpdateUserProfileOutput)
  @UseGuards(JwtAuthGuard)
  updateMyProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<UpdateUserProfileOutput> {
    return this.usersService.updateUserProfileById(user.id, input);
  }

  @Mutation(returns => DeleteUserOutput)
  @UseGuards(JwtAuthGuard)
  deleteMyAccount(@CurrentUser() user: User): Promise<DeleteUserOutput> {
    return this.usersService.deleteUserById(user.id);
  }

  @Mutation(returns => VerifyUserOutput)
  verifyUser(@Args('input') input: VerifyUserInput): Promise<VerifyUserOutput> {
    return this.usersService.verifyUser(input.code);
  }
}
