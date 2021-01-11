import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
} from './entities/photo-concept.entity';
import { StudioPhoto } from './entities/studio-photo.entity';
import { UsersClickStudioPhotos } from './entities/users-click-studio-photos.entity';
import { PhotosService } from './photos.service';
import { PhotosResolver } from './photos.resolver';
import { UsersModule } from 'src/users/users.module';
import { StudiosModule } from 'src/studios/studios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudioPhoto,
      BackgroundConcept,
      CostumeConcept,
      ObjectConcept,
      UsersClickStudioPhotos,
    ]),
    UsersModule,
    StudiosModule,
  ],
  providers: [PhotosService, PhotosResolver],
})
export class PhotosModule {}
