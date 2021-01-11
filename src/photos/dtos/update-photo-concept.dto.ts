import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PhotoConcept,
  PhotoConceptType,
} from '../entities/photo-concept.entity';

@InputType()
export class UpdatePhotoConceptPayload extends PickType(
  PhotoConcept,
  ['slug'],
  InputType,
) {}

@InputType()
export class UpdatePhotoConceptInput extends PickType(
  PhotoConcept,
  ['slug'],
  InputType,
) {
  @Field(type => PhotoConceptType)
  @IsEnum(PhotoConceptType)
  conceptType: PhotoConceptType;

  @Field(type => UpdatePhotoConceptPayload)
  payload: UpdatePhotoConceptPayload;
}

@ObjectType()
export class UpdatePhotoConceptOutput extends CoreOutput {
  @Field(type => PhotoConcept, { nullable: true })
  photoConcept?: PhotoConcept;
}
