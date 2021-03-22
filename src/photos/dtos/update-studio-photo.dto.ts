import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioPhoto } from '../entities/studio-photo.entity';
import { CreateStudioPhotoInput } from './create-studio-photo.dto';

@InputType()
class UpdateStudioPhotoPayload extends PartialType(
  PickType(CreateStudioPhotoInput, [
    'gender',
    'backgroundConceptSlugs',
    'costumeConceptSlugs',
    'objectConceptSlugs',
  ]),
) {}

@InputType()
export class UpdateStudioPhotoInput extends PickType(
  StudioPhoto,
  ['id'],
  InputType,
) {
  @Field(type => UpdateStudioPhotoPayload)
  payload: UpdateStudioPhotoPayload;
}

@ObjectType()
export class UpdateStudioPhotoOutput extends CoreOutput {
  @Field(type => StudioPhoto, { nullable: true })
  studioPhoto?: StudioPhoto;
}
