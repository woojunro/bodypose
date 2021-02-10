import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { Role, User } from 'src/users/entities/user.entity';
import {
  ClickStudioPhotoInput,
  ClickStudioPhotoOutput,
} from './dtos/click-studio-photo.dto';
import {
  CreatePhotoConceptInput,
  CreatePhotoConceptOutput,
} from './dtos/create-photo-concept.dto';
import {
  CreateStudioPhotoInput,
  CreateStudioPhotoOutput,
} from './dtos/create-studio-photo.dto';
import {
  DeletePhotoConceptInput,
  DeletePhotoConceptOutput,
} from './dtos/delete-photo-concept.dto';
import {
  DeleteStudioPhotoInput,
  DeleteStudioPhotoOutput,
} from './dtos/delete-studio-photo.dto';
import { GetAllPhotoConceptsOutput } from './dtos/get-photo-concept.dto';
import {
  GetAllStudioPhotosInput,
  GetAllStudioPhotosOutput,
  GetMyHeartStudioPhotosInput,
  GetStudioPhotosInput,
  GetStudioPhotosOutput,
} from './dtos/get-studio-photo.dto';
import {
  HeartStudioPhotoInput,
  HeartStudioPhotoOutput,
} from './dtos/heart-studio-photo.dto';
import {
  UpdatePhotoConceptInput,
  UpdatePhotoConceptOutput,
} from './dtos/update-photo-concept.dto';
import {
  UpdateStudioPhotoInput,
  UpdateStudioPhotoOutput,
} from './dtos/update-studio-photo.dto';
import { StudioPhoto } from './entities/studio-photo.entity';
import { UsersHeartStudioPhotos } from './entities/users-heart-studio-photos.entity';
import { PhotosService } from './photos.service';

@Resolver(of => StudioPhoto)
export class PhotosResolver {
  constructor(private readonly photosService: PhotosService) {}

  // Public
  @Query(returns => GetAllStudioPhotosOutput)
  allStudioPhotos(
    @CurrentUser() user: User,
    @Args('input') input: GetAllStudioPhotosInput,
  ): Promise<GetAllStudioPhotosOutput> {
    return this.photosService.getAllStudioPhotos(user, input);
  }

  // Public
  @Query(returns => GetStudioPhotosOutput)
  studioPhotos(
    @CurrentUser() user: User,
    @Args('input') input: GetStudioPhotosInput,
  ): Promise<GetStudioPhotosOutput> {
    return this.photosService.getStudioPhotos(user, input);
  }

  // Public
  @Query(returns => GetAllPhotoConceptsOutput)
  allPhotoConcepts(): Promise<GetAllPhotoConceptsOutput> {
    return this.photosService.getAllPhotoConcepts();
  }

  @Mutation(returns => CreateStudioPhotoOutput)
  @Roles(Role.ADMIN)
  createStudioPhoto(
    @Args('input') input: CreateStudioPhotoInput,
  ): Promise<CreateStudioPhotoOutput> {
    return this.photosService.createStudioPhoto(input);
  }

  @Mutation(returns => UpdateStudioPhotoOutput)
  @Roles(Role.ADMIN)
  updateStudioPhoto(
    @Args('input') input: UpdateStudioPhotoInput,
  ): Promise<UpdateStudioPhotoOutput> {
    return this.photosService.updateStudioPhoto(input);
  }

  @Mutation(returns => DeleteStudioPhotoOutput)
  @Roles(Role.ADMIN)
  deleteStudioPhoto(
    @Args('input') input: DeleteStudioPhotoInput,
  ): Promise<DeleteStudioPhotoOutput> {
    return this.photosService.deleteStudioPhoto(input);
  }

  @Mutation(returns => CreatePhotoConceptOutput)
  @Roles(Role.ADMIN)
  createPhotoConcept(
    @Args('input') input: CreatePhotoConceptInput,
  ): Promise<CreatePhotoConceptOutput> {
    return this.photosService.createPhotoConcept(input);
  }

  @Mutation(returns => UpdatePhotoConceptOutput)
  @Roles(Role.ADMIN)
  updatePhotoConcept(
    @Args('input') input: UpdatePhotoConceptInput,
  ): Promise<UpdatePhotoConceptOutput> {
    return this.photosService.updatePhotoConcept(input);
  }

  @Mutation(returns => DeletePhotoConceptOutput)
  @Roles(Role.ADMIN)
  deletePhotoConcept(
    @Args('input') input: DeletePhotoConceptInput,
  ): Promise<DeletePhotoConceptOutput> {
    return this.photosService.deletePhotoConcept(input);
  }

  // Public
  @Mutation(returns => ClickStudioPhotoOutput)
  clickStudioPhoto(
    @CurrentUser() user: User,
    @Args('input') input: ClickStudioPhotoInput,
  ): Promise<ClickStudioPhotoOutput> {
    return this.photosService.clickStudioPhoto(input, user);
  }
}

@Resolver(of => UsersHeartStudioPhotos)
export class UsersHeartStudioPhotosResolver {
  constructor(private readonly photosService: PhotosService) {}

  @Query(returns => GetStudioPhotosOutput)
  @Roles(Role.USER)
  myHeartStudioPhotos(
    @CurrentUser() user: User,
    @Args('input') input: GetMyHeartStudioPhotosInput,
  ): Promise<GetStudioPhotosOutput> {
    return this.photosService.getMyHeartStudioPhotos(user, input);
  }

  @Mutation(returns => HeartStudioPhotoOutput)
  @Roles(Role.USER)
  heartStudioPhoto(
    @CurrentUser() user: User,
    @Args('input') input: HeartStudioPhotoInput,
  ): Promise<HeartStudioPhotoOutput> {
    return this.photosService.heartStudioPhoto(user, input);
  }

  @Mutation(returns => HeartStudioPhotoOutput)
  @Roles(Role.USER)
  disheartStudioPhoto(
    @CurrentUser() user: User,
    @Args('input') input: HeartStudioPhotoInput,
  ): Promise<HeartStudioPhotoOutput> {
    return this.photosService.disheartStudioPhoto(user, input);
  }
}
