import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
    FileInterceptor('photo', {
      storage: memoryStorage(),
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadStudioPhoto(@UploadedFile() photo, @Body() body: UploadPhotoDto) {
    return this.uploadsService.uploadStudioPhoto(photo, body);
  }
}
