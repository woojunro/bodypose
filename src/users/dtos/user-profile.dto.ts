import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UserProfile } from '../entities/user-profile.entity';

@InputType()
export class CreateProfileInput extends PickType(
  UserProfile,
  ['nickname', 'isMale'],
  InputType,
) {}

@ObjectType()
export class CreateProfileOutput extends CoreOutput {}

@ObjectType()
export class GetProfileOutput extends CoreOutput {
  @Field(type => UserProfile, { nullable: true })
  profile?: UserProfile;
}

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {}

@ObjectType()
export class UpdateProfileOutput extends CoreOutput {}

@InputType()
export class AdminUpdateProfileInput extends UpdateProfileInput {
  @Field(type => Int)
  userId: number;
}

@InputType()
export class UpdateProfileImageInput extends PickType(
  UserProfile,
  ['profileImageUrl'],
  InputType,
) {}

@InputType()
export class DeleteProfileImageInput {
  @Field(type => Int, { nullable: true })
  userId?: number;
}
