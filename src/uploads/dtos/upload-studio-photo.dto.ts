import { IsString, MinLength } from 'class-validator';

export class UploadPhotoDto {
  studioSlug: string;
}

export class UploadStudioReviewDto extends UploadPhotoDto {
  @IsString()
  rating: string;

  @IsString()
  @MinLength(12)
  text: string;

  @IsString()
  isPhotoForProof: string;

  @IsString()
  thumbnailIndex: string;
}
