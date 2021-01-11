import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { Role, User } from 'src/users/entities/user.entity';
import {
  CreatePhotoConceptInput,
  CreatePhotoConceptOutput,
} from './dtos/create-photo-concept.dto';
import {
  CreateStudioPhotoInput,
  CreateStudioPhotoOutput,
} from './dtos/create-studio-photo.dto';
import {
  GetStudioPhotosInput,
  GetStudioPhotosOutput,
} from './dtos/get-studio-photo.dto';
import { StudioPhoto } from './entities/studio-photo.entity';
import { PhotosService } from './photos.service';

@Resolver(of => StudioPhoto)
export class PhotosResolver {
  constructor(private readonly photosService: PhotosService) {}

  // Public
  @Query(returns => GetStudioPhotosOutput)
  studioPhotos(
    @CurrentUser() user: User,
    @Args('input') input: GetStudioPhotosInput,
  ): Promise<GetStudioPhotosOutput> {
    return this.photosService.getStudioPhotos(input, user);
  }

  @Mutation(returns => CreateStudioPhotoOutput)
  @Roles(Role.ADMIN)
  createStudioPhoto(
    @Args('input') input: CreateStudioPhotoInput,
  ): Promise<CreateStudioPhotoOutput> {
    return this.photosService.createStudioPhoto(input);
  }

  @Mutation(returns => CreatePhotoConceptOutput)
  @Roles(Role.ADMIN)
  createPhotoConcept(
    @Args('input') input: CreatePhotoConceptInput,
  ): Promise<CreatePhotoConceptOutput> {
    return this.photosService.createPhotoConcept(input);
  }
}
