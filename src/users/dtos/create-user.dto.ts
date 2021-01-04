import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { LoginMethod, User } from '../entities/user.entity';

export type SocialLoginMethod = Exclude<LoginMethod, LoginMethod.EMAIL>;

@InputType()
export class CreateUserWithEmailInput extends PickType(
  User,
  ['email', 'password', 'nickname'],
  InputType,
) {}

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
