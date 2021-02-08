import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
export class GetAllStudioPhotosOutput extends CoreOutput {
  @Field(type => [StudioPhoto], { nullable: true })
  photos?: StudioPhoto[];
}

@ObjectType()
export class GetStudioPhotosOutput extends PaginationOutput {
  @Field(type => [StudioPhoto], { nullable: true })
  photos?: StudioPhoto[];
}
