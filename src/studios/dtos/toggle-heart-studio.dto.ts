import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
export class ToggleHeartStudioInput extends PickType(
  Studio,
  ['slug'],
  InputType,
) {}

@ObjectType()
export class ToggleHeartStudioOutput extends CoreOutput {
  @Field(type => Boolean, { nullable: true })
  isHearted?: boolean;
}
