import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { UserType, User } from 'src/users/entities/user.entity';
import {
  CreatePhotoConceptInput,
  CreatePhotoConceptOutput,
} from './dtos/create-photo-concept.dto';
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
  GetStudioPhotoInput,
  GetStudioPhotoOutput,
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
  @Query(returns => GetStudioPhotoOutput)
  studioPhoto(
    @CurrentUser() user: User,
    @Args('input') input: GetStudioPhotoInput,
  ): Promise<GetStudioPhotoOutput> {
    return this.photosService.getStudioPhoto(user, input);
  }

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

  @Mutation(returns => UpdateStudioPhotoOutput)
  @Roles(UserType.ADMIN)
  updateStudioPhoto(
    @Args('input') input: UpdateStudioPhotoInput,
  ): Promise<UpdateStudioPhotoOutput> {
    return this.photosService.updateStudioPhoto(input);
  }

  @Mutation(returns => DeleteStudioPhotoOutput)
  @Roles(UserType.ADMIN)
  deleteStudioPhoto(
    @Args('input') input: DeleteStudioPhotoInput,
  ): Promise<DeleteStudioPhotoOutput> {
    return this.photosService.deleteStudioPhoto(input);
  }

  @Mutation(returns => CreatePhotoConceptOutput)
  @Roles(UserType.ADMIN)
  createPhotoConcept(
    @Args('input') input: CreatePhotoConceptInput,
  ): Promise<CreatePhotoConceptOutput> {
    return this.photosService.createPhotoConcept(input);
  }

  @Mutation(returns => UpdatePhotoConceptOutput)
  @Roles(UserType.ADMIN)
  updatePhotoConcept(
    @Args('input') input: UpdatePhotoConceptInput,
  ): Promise<UpdatePhotoConceptOutput> {
    return this.photosService.updatePhotoConcept(input);
  }

  @Mutation(returns => DeletePhotoConceptOutput)
  @Roles(UserType.ADMIN)
  deletePhotoConcept(
    @Args('input') input: DeletePhotoConceptInput,
  ): Promise<DeletePhotoConceptOutput> {
    return this.photosService.deletePhotoConcept(input);
  }
}

@Resolver(of => UsersHeartStudioPhotos)
export class UsersHeartStudioPhotosResolver {
  constructor(private readonly photosService: PhotosService) {}

  @Query(returns => GetStudioPhotosOutput)
  @Roles(UserType.USER)
  myHeartStudioPhotos(
    @CurrentUser() user: User,
    @Args('input') input: GetMyHeartStudioPhotosInput,
  ): Promise<GetStudioPhotosOutput> {
    return this.photosService.getMyHeartStudioPhotos(user, input);
  }

  @Mutation(returns => HeartStudioPhotoOutput)
  @Roles(UserType.USER)
  heartStudioPhoto(
    @CurrentUser() user: User,
    @Args('input') input: HeartStudioPhotoInput,
  ): Promise<HeartStudioPhotoOutput> {
    return this.photosService.heartStudioPhoto(user, input);
  }

  @Mutation(returns => HeartStudioPhotoOutput)
  @Roles(UserType.USER)
  disheartStudioPhoto(
    @CurrentUser() user: User,
    @Args('input') input: HeartStudioPhotoInput,
  ): Promise<HeartStudioPhotoOutput> {
    return this.photosService.disheartStudioPhoto(user, input);
  }
}
