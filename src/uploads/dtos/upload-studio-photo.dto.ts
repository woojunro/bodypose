import { IsEnum, IsString, Length, MinLength } from 'class-validator';
import { PhotoGender } from 'src/photos/entities/studio-photo.entity';

export class UploadStudioPhotoDto {
  @Length(1, 20)
  studioSlug: string;
}

export class UploadStudioPortfolioPhotoDto extends UploadStudioPhotoDto {
  @IsEnum(PhotoGender)
  gender: PhotoGender;

  @Length(1)
  backgroundConceptSlugs: string;

  @Length(1)
  costumeConceptSlugs: string;

  @Length(1)
  objectConceptSlugs: string;
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
