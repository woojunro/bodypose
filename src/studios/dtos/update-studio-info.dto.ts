import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioInfo } from '../entities/studio-info.entity';
import { Studio } from '../entities/studio.entity';

@InputType()
class UpdateStudioInfoPayload extends PartialType(
  OmitType(StudioInfo, ['studio', 'updatedAt'], InputType),
) {}

@InputType()
export class UpdateStudioInfoInput extends PickType(
  Studio,
  ['slug'],
  InputType,
) {
  @Field(type => UpdateStudioInfoPayload)
  @ValidateNested()
  @Type(() => UpdateStudioInfoPayload)
  payload: UpdateStudioInfoPayload;
}

@ObjectType()
export class UpdateStudioInfoOutput extends CoreOutput {}
