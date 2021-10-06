import {
  Field,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { PhotoGender, StudioPhoto } from '../entities/studio-photo.entity';

@InputType()
export class GetAllStudioPhotosInput extends PaginationInput {
  @Field(type => Int, { defaultValue: 24 })
  take: number;

  @Field(type => PhotoGender, { nullable: true })
  gender?: PhotoGender;

  @Field(type => [String])
  backgroundConceptSlugs: string[];

  @Field(type => [String])
  costumeConceptSlugs: string[];

  @Field(type => [String])
  objectConceptSlugs: string[];
}

@InputType()
export class GetStudioPhotosInput extends PaginationInput {
  @Field(type => String)
  @IsString()
  studioSlug: string;

  @Field(type => PhotoGender, { nullable: true })
  @IsOptional()
  @IsEnum(PhotoGender)
  gender?: PhotoGender;
}

@InputType()
export class GetMyHeartStudioPhotosInput extends PaginationInput {}

@ObjectType()
export class StudioPhotoWithIsHearted extends OmitType(StudioPhoto, [
  'extractSubstrFromOriginalUrl',
]) {
  @Field(type => Boolean, { nullable: true })
  isHearted?: boolean;
}

@ObjectType()
export class GetAllStudioPhotosOutput extends PaginationOutput {
  @Field(type => [StudioPhotoWithIsHearted], { nullable: true })
  photos?: StudioPhotoWithIsHearted[];
}

@ObjectType()
export class GetStudioPhotosOutput extends PaginationOutput {
  @Field(type => [StudioPhotoWithIsHearted], { nullable: true })
  photos?: StudioPhotoWithIsHearted[];
}

@InputType()
export class GetStudioPhotoInput extends PickType(
  StudioPhoto,
  ['id'],
  InputType,
) {}

@ObjectType()
export class GetStudioPhotoOutput extends CoreOutput {
  @Field(type => StudioPhoto, { nullable: true })
  photo?: StudioPhoto;
}
