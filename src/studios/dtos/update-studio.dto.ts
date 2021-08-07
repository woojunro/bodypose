import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
class UpdateStudioPayload extends PartialType(
  PickType(Studio, ['name', 'slug'], InputType),
) {}

@InputType()
export class UpdateStudioInput extends PickType(Studio, ['id'], InputType) {
  @Field(type => UpdateStudioPayload)
  @ValidateNested()
  @Type(() => UpdateStudioPayload)
  payload: UpdateStudioPayload;
}

@ObjectType()
export class UpdateStudioOutput extends CoreOutput {
  @Field(type => Studio, { nullable: true })
  studio?: Studio;
}
