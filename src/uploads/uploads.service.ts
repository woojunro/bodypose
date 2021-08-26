import {
  BadRequestException,
  ForbiddenException,
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
  UploadStudioPhotoDto,
  UploadStudioPortfolioPhotoDto,
  UploadStudioReviewDto,
} from './dtos/upload-studio-photo.dto';
import { StudiosService } from 'src/studios/studios.service';
import { CreateStudioReviewOutput } from 'src/studios/dtos/create-studio-review.dto';
import { User } from 'src/users/entities/user.entity';
import { UploadFileOutput } from './dtos/upload-file.dto';
import {
  CommonError,
  INTERNAL_SERVER_ERROR,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { UsersService } from 'src/users/users.service';
import { PhotosService } from 'src/photos/photos.service';
import { CreateStudioPhotoOutput } from 'src/photos/dtos/create-studio-photo.dto';

@Injectable()
export class UploadsService {
  private bucket: Bucket;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => StudiosService))
    private readonly studiosService: StudiosService,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
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

  /*
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
  */

  async checkValidityOfAccess(
    studioSlug: string,
    user: User,
  ): Promise<boolean> {
    const studio = await this.studiosService.checkIfStudioExistsBySlug(
      studioSlug,
    );
    if (!studio) throw new NotFoundException('STUDIO_NOT_FOUND');
    const valid = await this.studiosService.checkIfUserIsAdminOrOwner(
      studio.id,
      user,
    );
    return valid;
  }

  async uploadStudioPhoto(
    user,
    photos,
    {
      studioSlug,
      gender,
      backgroundConceptSlugs,
      costumeConceptSlugs,
      objectConceptSlugs,
    }: UploadStudioPortfolioPhotoDto,
  ): Promise<CreateStudioPhotoOutput> {
    // Validate payload
    const errors: string[] = [];
    if (!photos?.thumbnail || photos.thumbnail.length === 0) {
      errors.push('NO_THUMBNAIL_PHOTO');
    }
    if (!photos?.original || photos.original.length === 0) {
      errors.push('NO_ORIGINAL_PHOTO');
    }
    if (errors.length) {
      const errorMessage = errors.join(',');
      throw new BadRequestException(errorMessage);
    }

    const valid = await this.checkValidityOfAccess(studioSlug, user);
    if (!valid) throw new ForbiddenException('FORBIDDEN');

    // Upload photos
    const thumbnailPhoto = photos.thumbnail[0];
    const originalPhoto = photos.original[0];
    const thumbnailPath = `studio-photos/${studioSlug}/thumbnails/${randomFileName(
      thumbnailPhoto,
    )}`;
    const originalPath = `studio-photos/${studioSlug}/originals/${randomFileName(
      originalPhoto,
    )}`;
    const thumbnail = await this.uploadFile(thumbnailPath, thumbnailPhoto);
    if (!thumbnail.ok) throw new InternalServerErrorException(thumbnail.error);
    const original = await this.uploadFile(originalPath, originalPhoto);
    if (!original.ok) throw new InternalServerErrorException(original.error);

    const {
      ok,
      error,
      studioPhoto,
    } = await this.photosService.createStudioPhoto({
      studioSlug,
      thumbnailUrl: thumbnail.url,
      originalUrl: original.url,
      gender,
      backgroundConceptSlugs: backgroundConceptSlugs.split(','),
      costumeConceptSlugs: costumeConceptSlugs.split(','),
      objectConceptSlugs: objectConceptSlugs.split(','),
    });
    if (!ok) throw new InternalServerErrorException(error);
    return { ok, studioPhoto };
  }

  async uploadStudioLogo(
    user: User,
    logo: File,
    { studioSlug }: UploadStudioPhotoDto,
  ): Promise<UploadFileOutput> {
    if (!logo) throw new BadRequestException('NO_LOGO');
    const valid = await this.checkValidityOfAccess(studioSlug, user);
    if (!valid) throw new ForbiddenException('FORBIDDEN');
    const filePath = `studio-logos/${studioSlug}/${randomFileName(logo)}`;
    const { ok, error, url } = await this.uploadFile(filePath, logo);
    if (!ok) throw new InternalServerErrorException(error);
    const ret = await this.studiosService.updateStudioLogo(studioSlug, url);
    if (ret === INTERNAL_SERVER_ERROR) {
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
    return { ok: true, url: ret };
  }

  async uploadStudioCoverPhoto(
    user: User,
    cover: File,
    { studioSlug }: UploadStudioPhotoDto,
  ): Promise<UploadFileOutput> {
    if (!cover) throw new BadRequestException('NO_COVER');
    const valid = await this.checkValidityOfAccess(studioSlug, user);
    if (!valid) throw new ForbiddenException('FORBIDDEN');
    const filePath = `studio-covers/${studioSlug}/${randomFileName(cover)}`;
    const { ok, error, url } = await this.uploadFile(filePath, cover);
    if (!ok) throw new InternalServerErrorException(error);
    const ret = await this.studiosService.updateStudioCoverPhoto(
      studioSlug,
      url,
    );
    if (ret === INTERNAL_SERVER_ERROR) {
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
    return { ok: true, url: ret };
  }

  async deleteFile(filePath: string): Promise<void> {
    await this.bucket.file(filePath).delete();
  }
}
