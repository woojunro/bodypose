import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateUserWithEmailInput } from 'src/users/dtos/create-user.dto';

@InputType()
export class LoginWithEmailInput extends PickType(CreateUserWithEmailInput, [
  'email',
  'password',
]) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(type => String, { nullable: true })
  token?: string;
}
