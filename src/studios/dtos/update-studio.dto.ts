import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
class UpdateStudioPayload extends PartialType(
  PickType(
    Studio,
    [
      'name',
      'logoUrl',
      'contactUrl',
      'reservationUrl',
      'studioProductListDescription',
      'outdoorProductListDescription',
      'weekdayPriceTag',
      'weekendPriceTag',
      'additionalProductListDescription',
    ],
    InputType,
  ),
) {}

@InputType()
export class UpdateStudioInput extends PickType(Studio, ['slug'], InputType) {
  @Field(type => UpdateStudioPayload)
  payload: UpdateStudioPayload;
}

@ObjectType()
export class UpdateStudioOutput extends CoreOutput {}
