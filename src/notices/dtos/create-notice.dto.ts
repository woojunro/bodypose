import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Notice } from '../entity/notice.entity';

@InputType()
export class CreateNoticeInput extends PickType(
  Notice,
  ['title', 'content'],
  InputType,
) {}

@ObjectType()
export class CreateNoticeOutput extends CoreOutput {}
