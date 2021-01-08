import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { PhotoGender, StudioPhoto } from '../entities/studio-photo.entity';

@InputType()
export class GetStudioPhotosInput extends PaginationInput {
  @Field(type => PhotoGender, { nullable: true })
  gender?: PhotoGender;

  @Field(type => [String])
  backgroundConceptSlugs: string[];

  @Field(type => [String])
  costumeConceptSlugs: string[];

  @Field(type => [String])
  objectConceptSlugs: string[];
}

@ObjectType()
export class StudioPhotoWithIsHearted extends StudioPhoto {
  @Field(type => Boolean)
  isHearted: boolean;
}

@ObjectType()
export class GetStudioPhotosOutput extends PaginationOutput {
  @Field(type => [StudioPhotoWithIsHearted], { nullable: true })
  photos?: StudioPhotoWithIsHearted[];
}
