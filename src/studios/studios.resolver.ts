import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { Role, User } from 'src/users/entities/user.entity';
import {
  CreateBranchInput,
  CreateBranchOutput,
} from './dtos/create-branch.dto';
import {
  CreateStudioProductsInput,
  CreateProductsOutput,
  CreateAdditionalProductsInput,
  CreateHairMakeupShopsInput,
  CreateHairMakeupShopsOutput,
} from './dtos/create-product.dto';
import {
  CreateStudioReviewInput,
  CreateStudioReviewOutput,
} from './dtos/create-studio-review.dto';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import {
  DeleteStudioReviewInput,
  DeleteStudioReviewOutput,
} from './dtos/delete-studio-review.dto';
import { GetProductsInput, GetProductsOutput } from './dtos/get-product.dto';
import {
  GetAllStudioReviewsInput,
  GetStudioReviewsInput,
  GetStudioReviewsOutput,
} from './dtos/get-studio-review.dto';
import {
  GetStudiosOutput,
  GetStudioInput,
  GetStudioOutput,
} from './dtos/get-studio.dto';
import { HeartStudioInput, HeartStudioOutput } from './dtos/heart-studio.dto';
import {
  UpdateBranchInput,
  UpdateBranchOutput,
} from './dtos/update-branch.dto';
import {
  UpdateStudioProductsInput,
  UpdateProductsOutput,
  UpdateAdditionalProductsInput,
  UpdateHairMakeupShopsOutput,
  UpdateHairMakeupShopsInput,
} from './dtos/update-product.dto';
import {
  UpdateStudioInput,
  UpdateStudioOutput,
} from './dtos/update-studio.dto';
import { StudioProduct } from './entities/studio-product.entity';
import { Studio } from './entities/studio.entity';
import { UsersHeartStudios } from './entities/users-heart-studios.entity';
import { UsersReviewStudios } from './entities/users-review-studios.entity';
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
  @Query(returns => GetStudiosOutput)
  allStudios(@CurrentUser() user: User): Promise<GetStudiosOutput> {
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
  @Query(returns => GetProductsOutput)
  products(@Args('input') input: GetProductsInput): Promise<GetProductsOutput> {
    return this.studiosService.getProducts(input);
  }

  @Mutation(returns => CreateProductsOutput)
  @Roles(Role.ADMIN)
  createStudioProducts(
    @Args('input') input: CreateStudioProductsInput,
  ): Promise<CreateProductsOutput> {
    return this.studiosService.createStudioProducts(input);
  }

  @Mutation(returns => UpdateProductsOutput)
  @Roles(Role.ADMIN)
  updateStudioProducts(
    @Args('input') input: UpdateStudioProductsInput,
  ): Promise<UpdateProductsOutput> {
    return this.studiosService.updateStudioProducts(input);
  }

  @Mutation(returns => CreateProductsOutput)
  @Roles(Role.ADMIN)
  createAdditionalProducts(
    @Args('input') input: CreateAdditionalProductsInput,
  ): Promise<CreateProductsOutput> {
    return this.studiosService.createAdditionalProducts(input);
  }

  @Mutation(returns => UpdateProductsOutput)
  @Roles(Role.ADMIN)
  updateAdditionalProducts(
    @Args('input') input: UpdateAdditionalProductsInput,
  ): Promise<UpdateProductsOutput> {
    return this.studiosService.updateAdditionalProducts(input);
  }

  @Mutation(returns => CreateHairMakeupShopsOutput)
  @Roles(Role.ADMIN)
  createHairMakeupShops(
    @Args('input') input: CreateHairMakeupShopsInput,
  ): Promise<CreateHairMakeupShopsOutput> {
    return this.studiosService.createHairMakeupShops(input);
  }

  @Mutation(returns => UpdateHairMakeupShopsOutput)
  @Roles(Role.ADMIN)
  updateHairMakeupShops(
    @Args('input') input: UpdateHairMakeupShopsInput,
  ): Promise<UpdateHairMakeupShopsOutput> {
    return this.studiosService.updateHairMakeupShops(input);
  }
}

@Resolver(of => UsersReviewStudios)
export class StudioReviewResolver {
  constructor(private readonly studiosService: StudiosService) {}

  // Public
  @Query(returns => GetStudioReviewsOutput)
  studioReviews(
    @Args('input') input: GetStudioReviewsInput,
  ): Promise<GetStudioReviewsOutput> {
    return this.studiosService.getStudioReviews(input);
  }

  // Public
  @Query(returns => GetStudioReviewsOutput)
  allStudioReviews(
    @Args('input') input: GetAllStudioReviewsInput,
  ): Promise<GetStudioReviewsOutput> {
    return this.studiosService.getAllStudioReviews(input);
  }

  /*
  @Mutation(returns => CreateStudioReviewOutput)
  @Roles(Role.USER)
  createStudioReview(
    @CurrentUser() user: User,
    @Args('input') input: CreateStudioReviewInput,
  ): Promise<CreateStudioReviewOutput> {
    return this.studiosService.createStudioReview(user, input);
  }
  */

  @Mutation(returns => DeleteStudioReviewOutput)
  @Roles(Role.USER, Role.ADMIN)
  deleteStudioReview(
    @CurrentUser() user: User,
    @Args('input') input: DeleteStudioReviewInput,
  ): Promise<DeleteStudioReviewOutput> {
    return this.studiosService.deleteStudioReview(user, input);
  }
}

@Resolver(of => UsersHeartStudios)
export class UsersHeartStudiosResolver {
  constructor(private readonly studiosService: StudiosService) {}

  @Query(returns => GetStudiosOutput)
  @Roles(Role.USER)
  myHeartStudios(@CurrentUser() user: User): Promise<GetStudiosOutput> {
    return this.studiosService.getHeartStudios(user);
  }

  @Mutation(returns => HeartStudioOutput)
  @Roles(Role.USER)
  heartStudio(
    @CurrentUser() user: User,
    @Args('input') input: HeartStudioInput,
  ): Promise<HeartStudioOutput> {
    return this.studiosService.heartStudio(user, input);
  }

  @Mutation(returns => HeartStudioOutput)
  @Roles(Role.USER)
  disheartStudio(
    @CurrentUser() user: User,
    @Args('input') input: HeartStudioInput,
  ): Promise<HeartStudioOutput> {
    return this.studiosService.disheartStudio(user, input);
  }
}
