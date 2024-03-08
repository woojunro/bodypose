import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@ObjectType()
export class GetMyStudiosOutput extends CoreOutput {
  @Field(type => [Studio])
  studios?: Studio[];
}
