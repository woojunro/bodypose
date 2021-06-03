import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OAuthProvider } from 'src/users/entities/user-oauth.entity';

export class EmailLoginInput {
  @IsEmail()
  @MaxLength(190)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class SocialLoginInput {
  @IsEnum(OAuthProvider)
  provider: OAuthProvider;

  @IsString()
  accessToken: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(190)
  email?: string;
}

export class LoginOutput {
  access: string;
  refresh: string;
}
