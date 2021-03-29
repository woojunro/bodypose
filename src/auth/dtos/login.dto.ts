import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateUserWithEmailInput } from 'src/users/dtos/create-user.dto';
import { SocialAccount } from 'src/users/entities/social-account.entity';

@InputType()
export class EmailLoginInput extends PickType(CreateUserWithEmailInput, [
  'email',
  'password',
]) {}

@InputType()
export class SocialLoginInput extends PickType(
  SocialAccount,
  ['provider'],
  InputType,
) {
  @Field(type => String)
  accessToken: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(type => String, { nullable: true })
  token?: string;
}
