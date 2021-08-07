import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { UploadFileOutput } from './dtos/upload-file.dto';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UploadsService {
  private bucket: Bucket;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => StudiosService))
    private readonly studiosService: StudiosService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    const storage = new Storage();
    const bucket_name = configService.get<string>('GCLOUD_STORAGE_BUCKET');
    this.bucket = storage.bucket(bucket_name);
  }

  async uploadFile(filePath: string, file: File): Promise<UploadFileOutput> {
    try {
      const blob = this.bucket.file(filePath);
      const promise: Promise<string> = new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream();
        blobStream.on('error', err => {
          reject(err.message);
        });
        blobStream.on('finish', () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`,
          );
          resolve(publicUrl);
        });
        blobStream.end(file.buffer);
      });

      return promise
        .then(url => {
          return { ok: true, url };
        })
        .catch(err => {
          return CommonError(err);
        });
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async uploadStudioReview(
    photos: File[],
    body: UploadStudioReviewDto,
    user: User,
  ): Promise<CreateStudioReviewOutput> {
    const { studioSlug, text } = body;
    const rating = Math.floor(Number(body.rating));
    const thumbnailIndex = Math.floor(Number(body.thumbnailIndex));
    const isPhotoForProof = body.isPhotoForProof === 'true';

    if (
      photos.length < 1 ||
      photos.length > 3 ||
      rating < 1 ||
      rating > 5 ||
      thumbnailIndex < 0 ||
      thumbnailIndex >= photos.length
    ) {
      throw new BadRequestException('INVALID_PAYLOAD');
    }
    if (!body.studioSlug) {
      throw new BadRequestException('NO_STUDIO_SLUG');
    }

    const studio = await this.studiosService.checkIfStudioExistsBySlug(
      body.studioSlug,
    );
    if (!studio) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'STUDIO_NOT_FOUND',
      });
    }

    const photoUrls: string[] = [];
    for (const photo of photos) {
      const { url, error } = await this.uploadFile(
        `review-photos/${body.studioSlug}/${randomFileName(photo)}`,
        photo,
      );
      if (error) throw new InternalServerErrorException();
      photoUrls.push(url);
    }

    return this.studiosService.createStudioReview(user, {
      studioSlug,
      payload: {
        rating,
        text,
        isPhotoForProof,
        photoUrls,
        thumbnailIndex,
      },
    });
  }

  async uploadProfileImage(user: User, profileImage: File) {
    const { url: profileImageUrl, error } = await this.uploadFile(
      `profile-images/${randomFileName(profileImage)}`,
      profileImage,
    );
    if (error) throw new InternalServerErrorException();

    return this.usersService.updateProfileImage(user, { profileImageUrl });
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

    const studio = await this.studiosService.checkIfStudioExistsBySlug(
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

  async deleteFile(filePath: string): Promise<void> {
    await this.bucket.file(filePath).delete();
  }
}
