import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
class UserProfile extends PickType(User, [
  'id',
  'loginMethod',
  'email',
  'nickname',
  'isVerified',
]) {}

@ObjectType()
export class GetMyProfileOutput extends CoreOutput {
  @Field(type => UserProfile, { nullable: true })
  profile?: UserProfile;
}
