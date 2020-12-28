import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

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
