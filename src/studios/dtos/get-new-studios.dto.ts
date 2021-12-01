import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
export class GetNewStudiosInput extends PickType(
  Studio,
  ['createdAt'],
  InputType,
) {}

@ObjectType()
export class GetNewStudiosOutput extends CoreOutput {
  @Field(type => [Studio], { nullable: true })
  studios?: Studio[];
}
