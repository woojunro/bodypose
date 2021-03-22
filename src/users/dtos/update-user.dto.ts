import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserProfileInput extends PartialType(
  PickType(User, ['email', 'nickname', 'gender', 'profileImageUrl'], InputType),
) {}

@ObjectType()
export class UpdateUserProfileOutput extends CoreOutput {
  @Field(type => User, { nullable: true })
  profile?: User;
}

@InputType()
export class UpdateNicknameInput extends PickType(
  User,
  ['nickname'],
  InputType,
) {}

@ObjectType()
export class UpdateNicknameOutput extends CoreOutput {}
