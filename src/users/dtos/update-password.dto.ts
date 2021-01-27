import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PasswordReset } from '../entities/password_reset.entity';
import { User } from '../entities/user.entity';

@InputType()
export class RequestPasswordResetInput extends PickType(
  User,
  ['email'],
  InputType,
) {}

@ObjectType()
export class RequestPasswordResetOutput extends CoreOutput {}

@InputType()
export class UpdatePasswordInput extends PickType(
  PasswordReset,
  ['code'],
  InputType,
) {
  @Field(type => String)
  @IsString()
  newPassword: string;
}

@ObjectType()
export class UpdatePasswordOutput extends CoreOutput {}
