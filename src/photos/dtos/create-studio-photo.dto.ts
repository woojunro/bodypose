import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PhotoGender, StudioPhoto } from '../entities/studio-photo.entity';

@InputType()
export class CreateStudioPhotoInput {
  @Field(type => String)
  studioSlug: string;

  @Field(type => PhotoGender)
  gender: PhotoGender;

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
