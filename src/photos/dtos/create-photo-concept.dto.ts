import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PhotoConcept } from '../entities/photo-concept.entity';

@InputType()
export class CreatePhotoConceptInput extends PickType(
  PhotoConcept,
  ['conceptType', 'slug'],
  InputType,
) {}

@ObjectType()
export class CreatePhotoConceptOutput extends CoreOutput {
  @Field(type => PhotoConcept, { nullable: true })
  photoConcept?: PhotoConcept;
}
