import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage, Bucket } from '@google-cloud/storage';

@Injectable()
export class UploadsService {
  private bucket: Bucket;
  constructor(private readonly configService: ConfigService) {
    const storage = new Storage();
    // TODO: BUCKET_NAME to ENV
    this.bucket = storage.bucket('NAME');
  }

  uploadReviewPhotos(photos) {
    try {
    } catch (e) {
      throw new BadRequestException('INVALID_FIELDS');
    }
  }
}
