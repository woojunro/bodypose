import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ToggleHeartStudioPhotoInput } from './toggle-heart-studio-photo.dto';

@InputType()
export class ClickStudioPhotoInput extends ToggleHeartStudioPhotoInput {}

@ObjectType()
export class ClickStudioPhotoOutput extends CoreOutput {
  @Field(type => Boolean, { nullable: true })
  isHearted?: boolean;
}
