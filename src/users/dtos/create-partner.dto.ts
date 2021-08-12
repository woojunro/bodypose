import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Partner } from '../entities/partner.entity';

@InputType()
export class CreatePartnerInput extends OmitType(
  Partner,
  ['id', 'createdAt', 'updatedAt', 'user', 'studios'],
  InputType,
) {
  @Field(type => String)
  @Length(8)
  password: string;
}

@ObjectType()
export class CreatePartnerOutput extends CoreOutput {}
