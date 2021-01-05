import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from 'src/studios/entities/studio.entity';
import { User } from '../entities/user.entity';

@ObjectType()
export class GetMyProfileOutput extends CoreOutput {
  @Field(type => User, { nullable: true })
  profile?: User;
}

@ObjectType()
export class GetMyHeartStudiosOutput extends CoreOutput {
  @Field(type => [Studio], { nullable: true })
  studios?: Studio[];
}
