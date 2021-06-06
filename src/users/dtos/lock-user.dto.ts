import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LockUserInput extends PickType(User, ['id'], InputType) {}

@ObjectType()
export class LockUserOutput extends CoreOutput {
  @Field(type => Boolean, { nullable: true })
  isLocked?: boolean;
}
