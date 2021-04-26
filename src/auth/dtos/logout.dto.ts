import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class LogoutInput {
  @Field(type => Boolean)
  fromAllDevices: boolean;
}

@ObjectType()
export class LogoutOutput extends CoreOutput {}
