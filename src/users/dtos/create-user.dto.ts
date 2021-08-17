import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateUserWithEmailInput {
  @Field(type => String)
  @IsEmail()
  @MaxLength(190)
  email: string;

  @Field(type => String)
  @IsString()
  @Length(8, 128)
  password: string;
}

@ObjectType()
export class CreateUserWithEmailOutput extends CoreOutput {}
