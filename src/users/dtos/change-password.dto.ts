import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class ChangePasswordInput {
  @Field(type => String)
  @Length(8, 128)
  currentPassword: string;

  @Field(type => String)
  @Length(8, 128)
  newPassword: string;
}

@ObjectType()
export class ChangePasswordOutput extends CoreOutput {}
