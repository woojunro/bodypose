import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { StudioPhoto } from 'src/photos/entities/studio-photo.entity';
import { Studio } from 'src/studios/entities/studio.entity';
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

@ObjectType()
export class GetMyHeartStudiosOutput extends CoreOutput {
  @Field(type => [Studio], { nullable: true })
  studios?: Studio[];
}

@InputType()
export class GetMyHeartStudioPhotosInput extends PaginationInput {}

@ObjectType()
export class GetMyHeartStudioPhotosOutput extends PaginationOutput {
  @Field(type => [StudioPhoto], { nullable: true })
  studioPhotos?: StudioPhoto[];
}
