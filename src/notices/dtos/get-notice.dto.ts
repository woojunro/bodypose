import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Notice } from '../entity/notice.entity';

@InputType()
export class GetNoticesInput extends PaginationInput {}

@ObjectType()
export class GetNoticesOutput extends PaginationOutput {
  @Field(type => [Notice], { nullable: true })
  notices?: Notice[];
}

@InputType()
export class GetNoticeInput extends PickType(Notice, ['id'], InputType) {}

@ObjectType()
export class GetNoticeOutput extends CoreOutput {
  @Field(type => Notice, { nullable: true })
  notice?: Notice;
}
