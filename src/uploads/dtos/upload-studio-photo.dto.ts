import {
  IsBoolean,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class UploadPhotoDto {
  studioSlug: string;
}

export class UploadStudioReviewDto extends UploadPhotoDto {
  @IsString()
  rating: number;

  @IsString()
  @MinLength(12)
  text: string;

  @IsString()
  isPhotoForProof: boolean;

  @IsString()
  thumbnailIndex: number;
}
