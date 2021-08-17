import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PasswordReset } from '../entities/password-reset.entity';

@InputType()
export class RequestPasswordResetInput {
  @Field(type => String)
  @IsEmail()
  @Length(1, 190)
  email: string;
}

@ObjectType()
export class RequestPasswordResetOutput extends CoreOutput {}

@InputType()
export class UpdatePasswordInput extends PickType(
  PasswordReset,
  ['code'],
  InputType,
) {
  @Field(type => Int)
  userId: number;

  @Field(type => String)
  @Length(8, 128)
  newPassword: string;
}

@ObjectType()
export class UpdatePasswordOutput extends CoreOutput {}
