import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Partner } from '../entities/partner.entity';

@InputType()
class UpdatePartnerPayload extends PartialType(
  OmitType(
    Partner,
    ['id', 'createdAt', 'updatedAt', 'email', 'user', 'studios'],
    InputType,
  ),
) {}

@InputType()
export class UpdatePartnerInput {
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(type => UpdatePartnerPayload)
  @ValidateNested()
  @Type(() => UpdatePartnerPayload)
  payload: UpdatePartnerPayload;
}

@ObjectType()
export class UpdatePartnerOutput extends CoreOutput {}
