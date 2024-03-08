import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class AssignStudioPartnerInput {
  @Field(type => String)
  @IsString()
  studioSlug: string;

  @Field(type => String)
  @IsEmail()
  partnerEmail: string;
}

@ObjectType()
export class AssignStudioPartnerOutput extends CoreOutput {}
