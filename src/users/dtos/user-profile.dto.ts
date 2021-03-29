import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UserProfile } from '../entities/user-profile.entity';

@InputType()
export class CreateMyProfileInput extends PickType(
  UserProfile,
  ['nickname', 'gender'],
  InputType,
) {}

@ObjectType()
export class CreateMyProfileOutput extends CoreOutput {}

@ObjectType()
export class GetMyProfileOutput extends CoreOutput {
  @Field(type => UserProfile, { nullable: true })
  profile?: UserProfile;
}
