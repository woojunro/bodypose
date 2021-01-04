import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from 'src/studios/entities/studio.entity';
import { User } from '../entities/user.entity';

@ObjectType()
export class Profile extends PickType(
  User,
  [
    'email',
    'gender',
    'isVerified',
    'nickname',
    'profileImageUrl',
    'createdWith',
  ],
  ObjectType,
) {}

@ObjectType()
export class GetMyProfileOutput extends CoreOutput {
  @Field(type => Profile, { nullable: true })
  profile?: Profile;
}

@ObjectType()
export class ReadMyHeartStudiosOutput extends CoreOutput {
  @Field(type => [Studio], { nullable: true })
  studios?: Studio[];
}
