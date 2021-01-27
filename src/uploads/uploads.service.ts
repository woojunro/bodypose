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
import { UploadPhotoDto } from './dtos/upload-studio-photo.dto';

@Injectable()
export class UploadsService {
  private bucket: Bucket;

  constructor(private readonly configService: ConfigService) {
    const storage = new Storage();
    const bucket_name = configService.get<string>('GCLOUD_STORAGE_BUCKET');
    this.bucket = storage.bucket(bucket_name);
  }

  async uploadReviewPhotos(photos: File[], body: UploadPhotoDto) {
    if (photos.length < 1) {
      throw new BadRequestException('NO_PHOTOS');
    }
    if (photos.length > 3) {
      throw new BadRequestException('TOO_MANY_PHOTOS');
    }
    if (!body.studioSlug) {
      throw new BadRequestException('NO_STUDIO_SLUG');
    }

    const urlPromises = [];
    for (const photo of photos) {
      const blob = this.bucket.file(
        `review-photos/${body.studioSlug}/${randomFileName(photo)}`,
      );
      const promise = new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream();
        blobStream
          .on('error', err => {
            console.log(err);
            reject(new InternalServerErrorException('GOOGLE_SERVER_ERROR'));
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

  async uploadStudioPhoto(photo: File, body: UploadPhotoDto) {
    if (!photo) {
      throw new BadRequestException('NO_PHOTO');
    }
    if (!body.studioSlug) {
      throw new BadRequestException('NO_STUDIO_SLUG');
    }
    const blob = this.bucket.file(
      `studio-photos/${body.studioSlug}/${randomFileName(photo)}`,
    );
    const promise: Promise<string> = new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream();
      blobStream
        .on('error', err => {
          console.log(err);
          reject(new InternalServerErrorException('GOOGLE_SERVER_ERROR'));
        })
        .on('finish', () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`,
          );
          resolve(publicUrl);
        })
        .end(photo.buffer);
    });

    return promise.then(url => {
      return {
        url,
      };
    });
  }
}
