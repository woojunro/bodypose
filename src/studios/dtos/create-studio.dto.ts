import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
export class CreateStudioInput extends PickType(
  Studio,
  ['name', 'slug', 'contactUrl', 'reservationUrl'],
  InputType,
) {}

@ObjectType()
export class CreateStudioOutput extends CoreOutput {
  @Field(type => Int, { nullable: true })
  id?: number;

  @Field(type => String, { nullable: true })
  slug?: string;
}
