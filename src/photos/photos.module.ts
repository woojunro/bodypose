import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoConcept } from './entities/photo-concept.entity';
import { StudioPhoto } from './entities/studio-photo.entity';
import { UserClickStudioPhoto } from './entities/user-click-studio-photo.entity';
import { PhotosService } from './photos.service';
import { PhotosResolver } from './photos.resolver';
import { UsersModule } from 'src/users/users.module';
import { StudiosModule } from 'src/studios/studios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudioPhoto, PhotoConcept, UserClickStudioPhoto]),
    UsersModule,
    StudiosModule,
  ],
  providers: [PhotosService, PhotosResolver],
})
export class PhotosModule {}
