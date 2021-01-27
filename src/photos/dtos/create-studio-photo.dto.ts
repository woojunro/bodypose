import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PhotoGender, StudioPhoto } from '../entities/studio-photo.entity';

@InputType()
export class CreateStudioPhotoInput extends PickType(
  StudioPhoto,
  ['gender', 'thumbnailUrl', 'originalUrl'],
  InputType,
) {
  @Field(type => String)
  studioSlug: string;

  @Field(type => [String])
  backgroundConceptSlugs: string[];

  @Field(type => [String])
  costumeConceptSlugs: string[];

  @Field(type => [String])
  objectConceptSlugs: string[];
}

@ObjectType()
export class CreateStudioPhotoOutput extends CoreOutput {
  @Field(type => StudioPhoto, { nullable: true })
  studioPhoto?: StudioPhoto;
}
