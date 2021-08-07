import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
export class CreateStudioInput extends PickType(
  Studio,
  ['name', 'slug'],
  InputType,
) {}

@ObjectType()
export class CreateStudioOutput extends CoreOutput {
  @Field(type => Studio, { nullable: true })
  studio?: Studio;
}
