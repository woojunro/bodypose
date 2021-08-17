import { Field, InputType, ObjectType } from '@nestjs/graphql';
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
