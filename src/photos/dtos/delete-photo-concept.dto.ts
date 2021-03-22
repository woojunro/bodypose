import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PhotoConcept,
  PhotoConceptType,
} from '../entities/photo-concept.entity';

@InputType()
export class DeletePhotoConceptInput extends PickType(
  PhotoConcept,
  ['slug'],
  InputType,
) {
  @Field(type => PhotoConceptType)
  @IsEnum(PhotoConceptType)
  conceptType: PhotoConceptType;
}

@ObjectType()
export class DeletePhotoConceptOutput extends CoreOutput {}
