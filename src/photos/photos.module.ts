import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosService } from './photos.service';
import {
  PhotosResolver,
  UsersHeartStudioPhotosResolver,
} from './photos.resolver';
import { UsersModule } from 'src/users/users.module';
import { StudiosModule } from 'src/studios/studios.module';
import { UploadsModule } from 'src/uploads/uploads.module';
import { PHOTOS_SERVICE_ENTITIES } from 'src/common/constants/entity-list.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([...PHOTOS_SERVICE_ENTITIES]),
    forwardRef(() => UsersModule),
    forwardRef(() => StudiosModule),
    forwardRef(() => UploadsModule),
  ],
  providers: [PhotosService, PhotosResolver, UsersHeartStudioPhotosResolver],
  exports: [PhotosService],
})
export class PhotosModule {}
