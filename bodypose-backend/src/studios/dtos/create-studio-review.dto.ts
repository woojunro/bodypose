import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import {
  IsInt,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UsersReviewStudios } from '../entities/users-review-studios.entity';

@InputType()
export class CreateStudioReviewPayload extends PickType(
  UsersReviewStudios,
  ['rating', 'text', 'isPhotoForProof'],
  InputType,
) {
  @Field(type => [String])
  @IsUrl({ protocols: ['https'] }, { each: true })
  photoUrls: string[];

  @Field(type => Int)
  @IsInt()
  @Min(0)
  @Max(2)
  thumbnailIndex: number;
}

@InputType()
export class CreateStudioReviewInput {
  @Field(type => String)
  @IsString()
  studioSlug: string;

  @Field(type => CreateStudioReviewPayload)
  @ValidateNested()
  payload: CreateStudioReviewPayload;
}

@ObjectType()
export class CreateStudioReviewOutput extends CoreOutput {}
