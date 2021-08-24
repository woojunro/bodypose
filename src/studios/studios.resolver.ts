import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UserType, User } from 'src/users/entities/user.entity';
import {
  AssignStudioPartnerInput,
  AssignStudioPartnerOutput,
} from './dtos/assign-studio-partner.dto';
import { ClickStudioReviewInput } from './dtos/click-studio-review.dto';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import {
  DeleteStudioReviewInput,
  DeleteStudioReviewOutput,
} from './dtos/delete-studio-review.dto';
import {
  GetAdditionalProductsInput,
  GetAdditionalProductsOutput,
} from './dtos/get-additional-products.dto';
import {
  GetHairMakeupShopsInput,
  GetHairMakeupShopsOutput,
} from './dtos/get-hair-makeup-shops.dto';
import { GetMyStudiosOutput } from './dtos/get-my-studios.dto';
import { GetProductsInput, GetProductsOutput } from './dtos/get-product.dto';
import {
  GetStudioProductsInput,
  GetStudioProductsOutput,
} from './dtos/get-studio-products.dto';
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
  ReportStudioReviewInput,
  ReportStudioReviewOutput,
} from './dtos/report-studio-review.dto';
import {
  UpdateAdditionalProductsInput,
  UpdateAdditionalProductsOutput,
} from './dtos/update-additional-product.dto';
import {
  UpdateBranchesInput,
  UpdateBranchesOutput,
} from './dtos/update-branch.dto';
import {
  UpdateHairMakeupShopsInput,
  UpdateHairMakeupShopsOutput,
} from './dtos/update-hair-makeup-shop.dto';
import {
  UpdateStudioInfoInput,
  UpdateStudioInfoOutput,
} from './dtos/update-studio-info.dto';
import {
  UpdateStudioProductsInput,
  UpdateStudioProductsOutput,
} from './dtos/update-studio-product.dto';
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

  @Query(returns => GetMyStudiosOutput)
  @Roles(UserType.ADMIN, UserType.STUDIO)
  myStudios(@CurrentUser() user: User): Promise<GetMyStudiosOutput> {
    return this.studiosService.getMyStudios(user);
  }

  @Mutation(returns => CreateStudioOutput)
  @Roles(UserType.ADMIN)
  createStudio(
    @Args('input') input: CreateStudioInput,
  ): Promise<CreateStudioOutput> {
    return this.studiosService.createStudio(input);
  }

  @Mutation(returns => AssignStudioPartnerOutput)
  @Roles(UserType.ADMIN)
  assignStudioPartner(
    @Args('input') input: AssignStudioPartnerInput,
  ): Promise<AssignStudioPartnerOutput> {
    return this.studiosService.assignStudioPartner(input);
  }

  @Mutation(returns => UpdateStudioOutput)
  @Roles(UserType.ADMIN, UserType.STUDIO)
  updateStudio(
    @CurrentUser() user: User,
    @Args('input') input: UpdateStudioInput,
  ): Promise<UpdateStudioOutput> {
    return this.studiosService.updateStudio(user, input);
  }

  @Mutation(returns => UpdateStudioInfoOutput)
  @Roles(UserType.ADMIN, UserType.STUDIO)
  updateStudioInfo(
    @CurrentUser() user: User,
    @Args('input') input: UpdateStudioInfoInput,
  ): Promise<UpdateStudioInfoOutput> {
    return this.studiosService.updateStudioInfo(user, input);
  }

  @Mutation(returns => UpdateBranchesOutput)
  @Roles(UserType.ADMIN, UserType.STUDIO)
  updateBranches(
    @CurrentUser() user: User,
    @Args('input') input: UpdateBranchesInput,
  ): Promise<UpdateBranchesOutput> {
    return this.studiosService.updateBranches(user, input);
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

  // Public
  @Query(returns => GetStudioProductsOutput)
  studioProducts(
    @CurrentUser() user: User,
    @Args('input') input: GetStudioProductsInput,
  ): Promise<GetStudioProductsOutput> {
    return this.studiosService.getStudioProducts(user, input);
  }

  @Mutation(returns => UpdateStudioProductsOutput)
  @Roles(UserType.ADMIN, UserType.STUDIO)
  updateStudioProducts(
    @CurrentUser() user: User,
    @Args('input') input: UpdateStudioProductsInput,
  ): Promise<UpdateStudioProductsOutput> {
    return this.studiosService.updateStudioProducts(user, input);
  }

  // Public
  @Query(returns => GetAdditionalProductsOutput)
  additionalProducts(
    @CurrentUser() user: User,
    @Args('input') input: GetAdditionalProductsInput,
  ): Promise<GetAdditionalProductsOutput> {
    return this.studiosService.getAdditionalProducts(user, input);
  }

  @Mutation(returns => UpdateAdditionalProductsOutput)
  @Roles(UserType.ADMIN, UserType.STUDIO)
  updateAdditionalProducts(
    @CurrentUser() user: User,
    @Args('input') input: UpdateAdditionalProductsInput,
  ): Promise<UpdateAdditionalProductsOutput> {
    return this.studiosService.updateAdditionalProducts(user, input);
  }

  // Public
  @Query(returns => GetHairMakeupShopsOutput)
  hairMakeupShops(
    @CurrentUser() user: User,
    @Args('input') input: GetHairMakeupShopsInput,
  ): Promise<GetHairMakeupShopsOutput> {
    return this.studiosService.getHairMakeupShops(user, input);
  }

  @Mutation(returns => UpdateHairMakeupShopsOutput)
  @Roles(UserType.ADMIN, UserType.STUDIO)
  updateHairMakeupShops(
    @CurrentUser() user: User,
    @Args('input') input: UpdateHairMakeupShopsInput,
  ): Promise<UpdateHairMakeupShopsOutput> {
    return this.studiosService.updateHairMakeupShops(user, input);
  }
}

/*
@Resolver(of => UsersReviewStudios)
export class StudioReviewResolver {
  constructor(private readonly studiosService: StudiosService) {}

  // Public
  @Query(returns => GetStudioReviewsOutput)
  studioReviews(
    @CurrentUser() user: User,
    @Args('input') input: GetStudioReviewsInput,
  ): Promise<GetStudioReviewsOutput> {
    return this.studiosService.getStudioReviews(user, input);
  }

  // Public
  @Query(returns => GetStudioReviewsOutput)
  allStudioReviews(
    @CurrentUser() user: User,
    @Args('input') input: GetAllStudioReviewsInput,
  ): Promise<GetStudioReviewsOutput> {
    return this.studiosService.getAllStudioReviews(user, input);
  }

  @Query(returns => GetStudioReviewsOutput)
  @Roles(UserType.USER)
  myStudioReviews(@CurrentUser() user: User): Promise<GetStudioReviewsOutput> {
    return this.studiosService.getMyStudioReviews(user);
  }

  // Public
  @Mutation(returns => CoreOutput)
  clickStudioReview(
    @Args('input') input: ClickStudioReviewInput,
  ): Promise<CoreOutput> {
    return this.studiosService.clickStudioReview(input);
  }

  @Mutation(returns => DeleteStudioReviewOutput)
  @Roles(UserType.USER, UserType.ADMIN)
  deleteStudioReview(
    @CurrentUser() user: User,
    @Args('input') input: DeleteStudioReviewInput,
  ): Promise<DeleteStudioReviewOutput> {
    return this.studiosService.deleteStudioReview(user, input);
  }

  // Public
  @Mutation(returns => ReportStudioReviewOutput)
  reportStudioReview(
    @CurrentUser() user: User,
    @Args('input') input: ReportStudioReviewInput,
  ): Promise<ReportStudioReviewOutput> {
    return this.studiosService.reportStudioReview(user, input);
  }
}
*/

@Resolver(of => UsersHeartStudios)
export class UsersHeartStudiosResolver {
  constructor(private readonly studiosService: StudiosService) {}

  @Query(returns => GetStudiosOutput)
  @Roles(UserType.USER)
  myHeartStudios(@CurrentUser() user: User): Promise<GetStudiosOutput> {
    return this.studiosService.getHeartStudios(user);
  }

  @Mutation(returns => HeartStudioOutput)
  @Roles(UserType.USER)
  heartStudio(
    @CurrentUser() user: User,
    @Args('input') input: HeartStudioInput,
  ): Promise<HeartStudioOutput> {
    return this.studiosService.heartStudio(user, input);
  }

  @Mutation(returns => HeartStudioOutput)
  @Roles(UserType.USER)
  disheartStudio(
    @CurrentUser() user: User,
    @Args('input') input: HeartStudioInput,
  ): Promise<HeartStudioOutput> {
    return this.studiosService.disheartStudio(user, input);
  }
}
