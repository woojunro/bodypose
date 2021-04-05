import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { SocialAccount } from 'src/users/entities/social-account.entity';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class EmailLoginInput extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

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

  @Field(type => String, { nullable: true })
  refresh?: string;
}
