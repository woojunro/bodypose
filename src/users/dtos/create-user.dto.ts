import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { LoginOutput } from 'src/auth/dtos/login.dto';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserWithEmailInput extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {
  @Field(type => String)
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  nickname: string;
}

@ObjectType()
export class CreateUserWithEmailOutput extends LoginOutput {}
