import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
} from '../entities/photo-concept.entity';

@ObjectType()
export class GetAllPhotoConceptsOutput extends CoreOutput {
  @Field(type => [BackgroundConcept], { nullable: true })
  backgroundConcepts?: BackgroundConcept[];

  @Field(type => [CostumeConcept], { nullable: true })
  costumeConcepts?: CostumeConcept[];

  @Field(type => [ObjectConcept], { nullable: true })
  objectConcepts?: ObjectConcept[];
}
