import { IsString, MinLength } from 'class-validator';

export class UploadStudioPhotoDto {
  studioSlug: string;
}

export class UploadStudioReviewDto extends UploadStudioPhotoDto {
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
