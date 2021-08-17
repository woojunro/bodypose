import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Partner } from '../entities/partner.entity';

@InputType()
export class GetPartnerInput {
  @Field(type => String)
  @IsOptional()
  @IsEmail()
  email: string;
}

@ObjectType()
export class GetPartnerOutput extends CoreOutput {
  @Field(type => Partner, { nullable: true })
  partner?: Partner;
}

@ObjectType()
class PartnerListElement extends PickType(Partner, [
  'id',
  'email',
  'reqStudioName',
]) {}

@ObjectType()
export class GetPartnersOutput extends CoreOutput {
  @Field(type => [PartnerListElement], { nullable: true })
  partners?: PartnerListElement[];
}
