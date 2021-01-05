import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import {
  GetAllStudiosOutput,
  GetStudioInput,
  GetStudioOutput,
} from './dtos/get-studio.dto';
import {
  ToggleHeartStudioInput,
  ToggleHeartStudioOutput,
} from './dtos/toggle-heart-studio.dto';
import { Studio } from './entities/studio.entity';
import { StudiosService } from './studios.service';

@Resolver(of => Studio)
export class StudiosResolver {
  constructor(private readonly studiosService: StudiosService) {}

  // Public
  @Query(returns => GetStudioOutput)
  studio(
    @CurrentUser() user: User,
    @Args('input') input: GetStudioInput,
  ): Promise<GetStudioOutput> {
    return this.studiosService.getStudio(user, input);
  }

  // Public
  @Query(returns => GetAllStudiosOutput)
  allStudios(@CurrentUser() user: User): Promise<GetAllStudiosOutput> {
    return this.studiosService.readAllStudios(user);
  }

  @Mutation(returns => CreateStudioOutput)
  createStudio(
    @Args('input') input: CreateStudioInput,
  ): Promise<CreateStudioOutput> {
    return this.studiosService.createStudio(input);
  }

  @Mutation(returns => ToggleHeartStudioOutput)
  @UseGuards(JwtAuthGuard)
  toggleHeartStudio(
    @CurrentUser() user: User,
    @Args('input') input: ToggleHeartStudioInput,
  ): Promise<ToggleHeartStudioOutput> {
    return this.studiosService.toggleHeartStudio(user, input);
  }
}
