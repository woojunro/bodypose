import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { UsersReviewStudios } from '../entities/users-review-studios.entity';

export enum StudioReviewOrder {
  DATE = 'DATE',
  RATING_ASC = 'RATING_ASC',
  RATING_DESC = 'RATING_DESC',
}

registerEnumType(StudioReviewOrder, {
  name: 'StudioReviewOrder',
});

@InputType()
export class GetStudioReviewsInput extends PaginationInput {
  @Field(type => String)
  @IsString()
  studioSlug: string;

  @Field(type => StudioReviewOrder, { defaultValue: StudioReviewOrder.DATE })
  @IsEnum(StudioReviewOrder)
  order: StudioReviewOrder;
}

@ObjectType()
export class GetStudioReviewsOutput extends PaginationOutput {
  @Field(type => [UsersReviewStudios], { nullable: true })
  studioReviews?: UsersReviewStudios[];
}
