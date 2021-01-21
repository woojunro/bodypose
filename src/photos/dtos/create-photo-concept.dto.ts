import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PhotoConcept,
  PhotoConceptType,
} from '../entities/photo-concept.entity';

@InputType()
export class CreatePhotoConceptInput extends PickType(
  PhotoConcept,
  ['name', 'slug'],
  InputType,
) {
  @Field(type => PhotoConceptType)
  conceptType: PhotoConceptType;
}

@ObjectType()
export class CreatePhotoConceptOutput extends CoreOutput {
  @Field(type => Int, { nullable: true })
  id?: number;
}
