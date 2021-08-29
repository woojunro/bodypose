import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { PartnersNotice } from '../entity/partners-notice.entity';

@InputType()
export class CreatePartnersNoticeInput extends PickType(
  PartnersNotice,
  ['title', 'content'],
  InputType,
) {}

@InputType()
export class GetPartnersNoticesInput extends PaginationInput {}

@ObjectType()
export class GetPartnersNoticesOutput extends PaginationOutput {
  @Field(type => [PartnersNotice], { nullable: true })
  partnersNotices?: PartnersNotice[];
}

@InputType()
export class GetPartnersNoticeInput extends PickType(
  PartnersNotice,
  ['id'],
  InputType,
) {}

@ObjectType()
export class GetPartnersNoticeOutput extends CoreOutput {
  @Field(type => PartnersNotice, { nullable: true })
  partnersNotice?: PartnersNotice;
}

@InputType()
export class UpdatePartnersNoticeInput extends PartialType(
  CreatePartnersNoticeInput,
) {
  @Field(type => Int)
  id: number;
}
