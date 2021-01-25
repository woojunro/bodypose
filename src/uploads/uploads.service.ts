import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage, Bucket } from '@google-cloud/storage';
import { File } from './dtos/file.dto';
import { randomFileName } from './utils/file-upload';
import { format } from 'url';

@Injectable()
export class UploadsService {
  private bucket: Bucket;

  constructor(private readonly configService: ConfigService) {
    const storage = new Storage();
    const bucket_name = configService.get<string>('GCLOUD_STORAGE_BUCKET');
    this.bucket = storage.bucket(bucket_name);
  }

  async uploadReviewPhotos(photos: File[]) {
    if (photos.length < 1) {
      throw new BadRequestException('NO_PHOTOS');
    }
    if (photos.length > 3) {
      throw new BadRequestException('TOO_MANY_PHOTOS');
    }

    const urlPromises = [];
    for (const photo of photos) {
      const blob = this.bucket.file(`review-photos/${randomFileName(photo)}`);
      const promise = new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream();
        blobStream
          .on('error', err => {
            console.log(err);
            reject('error');
          })
          .on('finish', () => {
            const publicUrl = format(
              `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`,
            );
            resolve(publicUrl);
          })
          .end(photo.buffer);
      });
      urlPromises.push(promise);
    }

    return Promise.all(urlPromises).then(promises => {
      return {
        urls: [...promises],
      };
    });
  }
}
