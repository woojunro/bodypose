import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateUserWithEmailInput {
  @Field(type => String)
  @IsEmail()
  @MaxLength(190)
  email: string;

  @Field(type => String)
  @IsString()
  @MinLength(8)
  password: string;
}

@ObjectType()
export class CreateUserWithEmailOutput extends CoreOutput {}
