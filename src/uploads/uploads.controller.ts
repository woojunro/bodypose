import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RestJwtAuthGuard } from 'src/auth/rest-jwt-auth.guard';
import { RestRoles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
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
  async uploadReviewPhotos(@UploadedFiles() photos) {
    return this.uploadsService.uploadReviewPhotos(photos);
  }
}
