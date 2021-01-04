import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';
import { Profile } from './get-my-profile.dto';

@InputType()
export class UpdateUserProfileInput extends PartialType(
  PickType(User, ['email', 'nickname', 'gender', 'profileImageUrl'], InputType),
) {}

@ObjectType()
export class UpdateUserProfileOutput extends CoreOutput {
  @Field(type => Profile, { nullable: true })
  profile?: Profile;
}
