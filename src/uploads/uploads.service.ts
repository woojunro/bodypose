import { Injectable } from '@nestjs/common';
import { File } from './utils/file-upload';

@Injectable()
export class UploadsService {
  uploadReviewPhotos(photos: File[]) {
    return {
      photoUrls: photos.map(photo => photo.path),
    };
  }
}
