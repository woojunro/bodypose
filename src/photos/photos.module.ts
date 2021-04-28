import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
} from './entities/photo-concept.entity';
import { StudioPhoto } from './entities/studio-photo.entity';
import { PhotosService } from './photos.service';
import {
  PhotosResolver,
  UsersHeartStudioPhotosResolver,
} from './photos.resolver';
import { UsersModule } from 'src/users/users.module';
import { StudiosModule } from 'src/studios/studios.module';
import { ReviewPhoto } from './entities/review-photo.entity';
import { UsersHeartStudioPhotos } from './entities/users-heart-studio-photos.entity';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudioPhoto,
      BackgroundConcept,
      CostumeConcept,
      ObjectConcept,
      ReviewPhoto,
      UsersHeartStudioPhotos,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => StudiosModule),
    forwardRef(() => UploadsModule),
  ],
  providers: [PhotosService, PhotosResolver, UsersHeartStudioPhotosResolver],
  exports: [PhotosService],
})
export class PhotosModule {}
