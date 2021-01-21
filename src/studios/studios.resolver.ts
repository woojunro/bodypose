import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { Role, User } from 'src/users/entities/user.entity';
import {
  CreateBranchInput,
  CreateBranchOutput,
} from './dtos/create-branch.dto';
import {
  CreateProductInput,
  CreateProductOutput,
} from './dtos/create-product.dto';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import {
  DeleteProductInput,
  DeleteProductOutput,
} from './dtos/delete-product.dto';
import {
  GetStudioProductsInput,
  GetStudioProductsOutput,
} from './dtos/get-product.dto';
import {
  GetAllStudiosOutput,
  GetStudioInput,
  GetStudioOutput,
} from './dtos/get-studio.dto';
import {
  ToggleHeartStudioInput,
  ToggleHeartStudioOutput,
} from './dtos/toggle-heart-studio.dto';
import {
  UpdateBranchInput,
  UpdateBranchOutput,
} from './dtos/update-branch.dto';
import {
  UpdateProductInput,
  UpdateProductOutput,
} from './dtos/update-product.dto';
import {
  UpdateStudioInput,
  UpdateStudioOutput,
} from './dtos/update-studio.dto';
import { StudioProduct } from './entities/studio-product.entity';
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
    return this.studiosService.getAllStudios(user);
  }

  @Mutation(returns => CreateStudioOutput)
  @Roles(Role.ADMIN)
  createStudio(
    @Args('input') input: CreateStudioInput,
  ): Promise<CreateStudioOutput> {
    return this.studiosService.createStudio(input);
  }

  @Mutation(returns => UpdateStudioOutput)
  @Roles(Role.ADMIN)
  updateStudio(
    @Args('input') input: UpdateStudioInput,
  ): Promise<UpdateStudioOutput> {
    return this.studiosService.updateStudio(input);
  }

  @Mutation(returns => ToggleHeartStudioOutput)
  @Roles(Role.USER)
  toggleHeartStudio(
    @CurrentUser() user: User,
    @Args('input') input: ToggleHeartStudioInput,
  ): Promise<ToggleHeartStudioOutput> {
    return this.studiosService.toggleHeartStudio(user, input);
  }

  @Mutation(returns => CreateBranchOutput)
  @Roles(Role.ADMIN)
  createBranches(
    @Args('input') input: CreateBranchInput,
  ): Promise<CreateBranchOutput> {
    return this.studiosService.createBranches(input);
  }

  @Mutation(returns => UpdateBranchOutput)
  @Roles(Role.ADMIN)
  updateBranches(
    @Args('input') input: UpdateBranchInput,
  ): Promise<UpdateBranchOutput> {
    return this.studiosService.updateBranches(input);
  }
}

@Resolver(of => StudioProduct)
export class ProductResolver {
  constructor(private readonly studiosService: StudiosService) {}

  // Public
  @Query(returns => GetStudioProductsOutput)
  studioProducts(
    @Args('input') input: GetStudioProductsInput,
  ): Promise<GetStudioProductsOutput> {
    return this.studiosService.getStudioProducts(input);
  }

  @Mutation(returns => CreateProductOutput)
  @Roles(Role.ADMIN)
  createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<CreateProductOutput> {
    return this.studiosService.createProduct(input);
  }

  @Mutation(returns => UpdateProductOutput)
  @Roles(Role.ADMIN)
  updateProduct(
    @Args('input') input: UpdateProductInput,
  ): Promise<UpdateProductOutput> {
    return this.studiosService.updateProduct(input);
  }

  @Mutation(returns => DeleteProductOutput)
  @Roles(Role.ADMIN)
  deleteProduct(
    @Args('input') input: DeleteProductInput,
  ): Promise<DeleteProductOutput> {
    return this.studiosService.deleteProduct(input);
  }
}
