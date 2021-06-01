import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UserOauth } from 'src/users/entities/user-oauth.entity';

export class EmailLoginInput {
  @IsEmail()
  @MaxLength(190)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

@InputType()
export class SocialLoginInput extends PickType(
  UserOauth,
  ['provider'],
  InputType,
) {
  @Field(type => String)
  accessToken: string;
}

@ObjectType()
export class LoginOutputDeprecated extends CoreOutput {
  @Field(type => String, { nullable: true })
  token?: string;

  @Field(type => String, { nullable: true })
  refresh?: string;
}

export class LoginOutput {
  access: string;
  refresh: string;
}
