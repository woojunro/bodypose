import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PhotosModule } from 'src/photos/photos.module';
import { StudiosModule } from 'src/studios/studios.module';
import { UsersModule } from 'src/users/users.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => StudiosModule),
    forwardRef(() => UsersModule),
    forwardRef(() => PhotosModule),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
