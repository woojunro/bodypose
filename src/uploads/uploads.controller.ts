import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RestJwtAuthGuard } from 'src/auth/rest-jwt-auth.guard';
import { RestRoles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { UploadPhotoDto } from './dtos/upload-studio-photo.dto';
import { UploadsService } from './uploads.service';
import { imageFileFilter } from './utils/file-upload';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('review-photos')
  @RestRoles(Role.USER)
  @UseGuards(RestJwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('photos', 3, {
      storage: memoryStorage(),
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadReviewPhotos(
    @UploadedFiles() photos,
    @Body() body: UploadPhotoDto,
  ) {
    return this.uploadsService.uploadReviewPhotos(photos, body);
  }

  @Post('studio-photo')
  @RestRoles(Role.ADMIN)
  @UseGuards(RestJwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'original', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          fileSize: 1 * 1024 * 1024, // 1MB
        },
        fileFilter: imageFileFilter,
      },
    ),
  )
  async uploadStudioPhoto(
    @UploadedFiles() photos,
    @Body() body: UploadPhotoDto,
  ) {
    return this.uploadsService.uploadStudioPhoto(photos, body);
  }
}
