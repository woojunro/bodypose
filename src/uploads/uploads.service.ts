import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage, Bucket } from '@google-cloud/storage';
import { File } from './dtos/file.dto';
import { randomFileName } from './utils/file-upload';
import { format } from 'url';
import {
  UploadPhotoDto,
  UploadStudioReviewDto,
} from './dtos/upload-studio-photo.dto';
import { StudiosService } from 'src/studios/studios.service';
import { CreateStudioReviewOutput } from 'src/studios/dtos/create-studio-review.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UploadsService {
  private bucket: Bucket;

  constructor(
    private readonly configService: ConfigService,
    private readonly studiosService: StudiosService,
  ) {
    const storage = new Storage();
    const bucket_name = configService.get<string>('GCLOUD_STORAGE_BUCKET');
    this.bucket = storage.bucket(bucket_name);
  }

  async uploadStudioReview(
    photos: File[],
    body: UploadStudioReviewDto,
    user: User,
  ): Promise<CreateStudioReviewOutput> {
    if (photos.length < 1) {
      throw new BadRequestException('NO_PHOTOS');
    }
    if (photos.length > 3) {
      throw new BadRequestException('TOO_MANY_PHOTOS');
    }
    if (!body.studioSlug) {
      throw new BadRequestException('NO_STUDIO_SLUG');
    }

    if (body.rating < 1 || body.rating > 5) {
      throw new BadRequestException('INVALID_PAYLOAD');
    }
    if (body.thumbnailIndex < 0 || body.thumbnailIndex >= photos.length) {
      throw new BadRequestException('INVALID_PAYLOAD');
    }

    const studio = await this.studiosService.checkIfStudioExists(
      body.studioSlug,
    );
    if (!studio) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'STUDIO_NOT_FOUND',
      });
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
      return this.studiosService.createStudioReview(user, {
        studioSlug: body.studioSlug,
        payload: {
          rating: Number(body.rating),
          text: body.text,
          isPhotoForProof: Boolean(body.isPhotoForProof),
          photoUrls: [...promises],
          thumbnailIndex: Number(body.thumbnailIndex),
        },
      });
    });
  }

  async uploadStudioPhoto(photos, body: UploadPhotoDto) {
    if (!photos) {
      throw new BadRequestException('NO_PHOTO');
    }
    if (!photos.thumbnail || photos.thumbnail.length === 0) {
      throw new BadRequestException('NO_THUMBNAIL_PHOTO');
    }
    if (!photos.original || photos.original.length === 0) {
      throw new BadRequestException('NO_ORIGINAL_PHOTO');
    }
    if (!body.studioSlug) {
      throw new BadRequestException('NO_STUDIO_SLUG');
    }

    const studio = await this.studiosService.checkIfStudioExists(
      body.studioSlug,
    );
    if (!studio) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'STUDIO_NOT_FOUND',
      });
    }

    const thumbnailPhoto = photos.thumbnail[0];
    const originalPhoto = photos.original[0];
    const promises = [];

    const thumbnailBlob = this.bucket.file(
      `studio-photos/${body.studioSlug}/thumbnails/${randomFileName(
        thumbnailPhoto,
      )}`,
    );
    const thumbnailPromise: Promise<string> = new Promise((resolve, reject) => {
      const thumbnailBlobStream = thumbnailBlob.createWriteStream();
      thumbnailBlobStream
        .on('error', err => {
          console.log(err);
          reject(new InternalServerErrorException('GOOGLE_SERVER_ERROR'));
        })
        .on('finish', () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${this.bucket.name}/${thumbnailBlob.name}`,
          );
          resolve(publicUrl);
        })
        .end(thumbnailPhoto.buffer);
    });
    promises.push(thumbnailPromise);

    const originalBlob = this.bucket.file(
      `studio-photos/${body.studioSlug}/originals/${randomFileName(
        thumbnailPhoto,
      )}`,
    );
    const originalPromise: Promise<string> = new Promise((resolve, reject) => {
      const originalBlobStream = originalBlob.createWriteStream();
      originalBlobStream
        .on('error', err => {
          console.log(err);
          reject(new InternalServerErrorException('GOOGLE_SERVER_ERROR'));
        })
        .on('finish', () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${this.bucket.name}/${originalBlob.name}`,
          );
          resolve(publicUrl);
        })
        .end(originalPhoto.buffer);
    });
    promises.push(originalPromise);

    return Promise.all(promises).then(promises => {
      return {
        studioSlug: body.studioSlug,
        thumbnailUrl: promises[0],
        originalUrl: promises[1],
      };
    });
  }
}
