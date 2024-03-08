import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Notice } from '../entity/notice.entity';

@InputType()
export class DeleteNoticeInput extends PickType(Notice, ['id'], InputType) {}

@ObjectType()
export class DeleteNoticeOutput extends CoreOutput {}
