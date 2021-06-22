import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class GetUserInfoInput {
  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;
}

@ObjectType()
class UserInfo extends PickType(
  User,
  [
    'id',
    'createdAt',
    'type',
    'email',
    'lastLoginAt',
    'isVerified',
    'deletedAt',
    'oauthList',
    'profile',
  ],
  ObjectType,
) {}

@ObjectType()
export class GetUserInfoOutput extends CoreOutput {
  @Field(type => UserInfo, { nullable: true })
  userInfo?: UserInfo;
}
