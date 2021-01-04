import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import {
  ReadAllStudiosOutput,
  ReadStudioInput,
  ReadStudioOutput,
} from './dtos/read-studio.dto';
import { Studio } from './entities/studio.entity';
import { StudiosService } from './studios.service';

@Resolver(of => Studio)
export class StudiosResolver {
  constructor(private readonly studiosService: StudiosService) {}

  @Query(returns => ReadStudioOutput)
  studio(@Args('input') input: ReadStudioInput): Promise<ReadStudioOutput> {
    return this.studiosService.readStudio(input);
  }

  @Query(returns => ReadAllStudiosOutput)
  allStudios(): Promise<ReadAllStudiosOutput> {
    return this.studiosService.readAllStudios();
  }

  @Mutation(returns => CreateStudioOutput)
  createStudio(
    @Args('input') input: CreateStudioInput,
  ): Promise<CreateStudioOutput> {
    return this.studiosService.createStudio(input);
  }
}
