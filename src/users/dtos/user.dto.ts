import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UserInput {
  @Field(type => Int)
  userId: number;
}

@ObjectType()
export class UserOutput extends CoreOutput {
  @Field(type => User, { nullable: true })
  user?: User;
}
