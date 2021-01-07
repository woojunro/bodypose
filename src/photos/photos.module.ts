import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoConcept } from './entities/photo-concept.entity';
import { StudioPhoto } from './entities/studio-photo.entity';
import { UserClickStudioPhoto } from './entities/user-click-studio-photo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudioPhoto, PhotoConcept, UserClickStudioPhoto]),
  ],
})
export class PhotosModule {}
