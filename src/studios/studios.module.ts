import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudiosService } from './studios.service';
import {
  ProductResolver,
  // StudioReviewResolver,
  StudiosResolver,
  UsersHeartStudiosResolver,
} from './studios.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { PhotosModule } from 'src/photos/photos.module';
import { UploadsModule } from 'src/uploads/uploads.module';
import { STUDIOS_SERVICE_ENTITIES } from 'src/common/constants/entity-list.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([...STUDIOS_SERVICE_ENTITIES]),
    AuthModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PhotosModule),
    forwardRef(() => UploadsModule),
  ],
  providers: [
    StudiosService,
    StudiosResolver,
    ProductResolver,
    UsersHeartStudiosResolver,
    // StudioReviewResolver,
  ],
  exports: [StudiosService],
})
export class StudiosModule {}
