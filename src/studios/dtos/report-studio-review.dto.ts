import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UsersReportStudioReviews } from '../entities/users-report-studio-reviews.entity';

@InputType()
export class ReportStudioReviewInput extends PickType(
  UsersReportStudioReviews,
  ['reason', 'detail'],
  InputType,
) {
  @Field(type => Int)
  @IsInt()
  studioReviewId: number;
}

@ObjectType()
export class ReportStudioReviewOutput extends CoreOutput {}
