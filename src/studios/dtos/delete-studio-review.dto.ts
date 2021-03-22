import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UsersReviewStudios } from 'src/studios/entities/users-review-studios.entity';

@InputType()
export class DeleteStudioReviewInput extends PickType(
  UsersReviewStudios,
  ['id'],
  InputType,
) {}

@ObjectType()
export class DeleteStudioReviewOutput extends CoreOutput {}
