import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { PhotoGender } from '../entities/studio-photo.entity';
import { StudioPhotoWithIsHearted } from './get-studio-photo.dto';

@InputType()
export class GetConceptBookPhotosInput extends PaginationInput {
  @Field(type => Int, { defaultValue: 24 })
  @Min(1)
  @Max(24)
  take: number;

  @Field(type => PhotoGender, { nullable: true })
  gender?: PhotoGender;

  @Field(type => [String])
  backgroundConceptSlugs: string[];

  @Field(type => [String])
  costumeConceptSlugs: string[];

  @Field(type => [String])
  objectConceptSlugs: string[];

  @Field(type => Int)
  @Min(0)
  @Max(10000)
  randomSeed: number;
}

@ObjectType()
export class GetConceptBookPhotosOutput extends PaginationOutput {
  @Field(type => [StudioPhotoWithIsHearted], { nullable: true })
  photos?: StudioPhotoWithIsHearted[];
}
