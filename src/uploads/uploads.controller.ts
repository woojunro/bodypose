import * as path from 'path';
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import MulterGoogleCloudStorage from 'multer-google-storage';
import { UploadsService } from './uploads.service';
import { File, imageFileFilter, randomFileName } from './utils/file-upload';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('review-photos')
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      storage: new MulterGoogleCloudStorage({
        projectId: 'bodypose-300107',
        keyFilename: './test-key.json',
        bucket: 'bodypose-storage-test',
        filename: (_, file, cb) => {
          cb(null, randomFileName(file));
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadReviewPhotos(@UploadedFiles() files: File[]) {
    return this.uploadsService.uploadReviewPhotos(files);
  }
}
