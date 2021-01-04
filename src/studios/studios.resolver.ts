import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import { Studio } from './entities/studio.entity';
import { StudiosService } from './studios.service';

@Resolver(of => Studio)
export class StudiosResolver {
  constructor(private readonly studiosService: StudiosService) {}

  @Mutation(returns => CreateStudioOutput)
  async createStudio(
    @Args('input') input: CreateStudioInput,
  ): Promise<CreateStudioOutput> {
    return this.studiosService.createStudio(input);
  }
}
