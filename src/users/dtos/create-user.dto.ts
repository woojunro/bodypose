import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { LoginMethod, User } from '../entities/user.entity';

export type SocialLoginMethod = Exclude<LoginMethod, LoginMethod.EMAIL>;

@InputType()
export class CreateUserWithEmailInput extends PickType(
  User,
  ['nickname'],
  InputType,
) {
  // Mandatory fields로 재작성
  @Field(type => String)
  @IsEmail()
  email: string;

  @Field(type => String)
  @IsString()
  password: string;
}

@ObjectType()
export class CreateUserWithEmailOutput extends CoreOutput {
  @Field(type => String, { nullable: true })
  token?: string;
}

@InputType()
export class CreateOrLoginUserWithOAuthInput {
  @Field(type => String)
  accessToken: string;

  @Field(type => LoginMethod)
  createWith: SocialLoginMethod;
}

@ObjectType()
export class CreateOrLoginUserWithOAuthOutput extends CreateUserWithEmailOutput {}
