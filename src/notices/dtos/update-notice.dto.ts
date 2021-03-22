import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Notice } from '../entity/notice.entity';

@InputType()
class UpdateNoticePayload extends PartialType(
  PickType(Notice, ['title', 'content'], InputType),
) {}

@InputType()
export class UpdateNoticeInput extends PickType(Notice, ['id'], InputType) {
  @Field(type => UpdateNoticePayload)
  payload: UpdateNoticePayload;
}

@ObjectType()
export class UpdateNoticeOutput extends CoreOutput {}
