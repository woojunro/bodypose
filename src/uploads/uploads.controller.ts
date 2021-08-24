import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { PhotoConcept } from 'src/photos/entities/photo-concept.entity';
import { CreateStudioReviewOutput } from 'src/studios/dtos/create-studio-review.dto';
import { UserType, User } from 'src/users/entities/user.entity';
import { ONE_MEGABYTE_IN_BYTES } from './constants/file-size.constant';
import { UploadFileOutput } from './dtos/upload-file.dto';
import {
  UploadStudioPhotoDto,
  UploadStudioReviewDto,
} from './dtos/upload-studio-photo.dto';
import { UploadsService } from './uploads.service';
import { imageFileFilter } from './utils/file-upload';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /*
  @Post('studio-review')
  @Roles(UserType.USER)
  @UseInterceptors(
    FilesInterceptor('photos', 3, {
      storage: memoryStorage(),
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadReviewReview(
    @UploadedFiles() photos,
    @Body() body: UploadStudioReviewDto,
    @CurrentUser() user: User,
  ): Promise<CreateStudioReviewOutput> {
    return this.uploadsService.uploadStudioReview(photos, body, user);
  }
  */

  @Post('studio-photo')
  @Roles(UserType.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'original', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: ONE_MEGABYTE_IN_BYTES },
        fileFilter: imageFileFilter,
      },
    ),
  )
  async uploadStudioPhoto(
    @UploadedFiles() photos,
    @Body() body: UploadStudioPhotoDto,
  ) {
    return this.uploadsService.uploadStudioPhoto(photos, body);
  }

  @Post('studio-logo')
  @Roles(UserType.ADMIN, UserType.STUDIO)
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: memoryStorage(),
      limits: { fileSize: ONE_MEGABYTE_IN_BYTES },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadStudioLogo(
    @CurrentUser() user: User,
    @UploadedFile() logo,
    @Body() body: UploadStudioPhotoDto,
  ): Promise<UploadFileOutput> {
    return this.uploadsService.uploadStudioLogo(user, logo, body);
  }

  @Post('studio-cover')
  @Roles(UserType.ADMIN, UserType.STUDIO)
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: memoryStorage(),
      limits: { fileSize: ONE_MEGABYTE_IN_BYTES },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadStudioCoverPhoto(
    @CurrentUser() user: User,
    @UploadedFile() cover,
    @Body() body: UploadStudioPhotoDto,
  ): Promise<UploadFileOutput> {
    return this.uploadsService.uploadStudioCoverPhoto(user, cover, body);
  }

  /*
  @Post('profile-image')
  @Roles(UserType.USER, UserType.STUDIO)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadProfileImage(
    @CurrentUser() user: User,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    return this.uploadsService.uploadProfileImage(user, profileImage);
  }
  */
}
