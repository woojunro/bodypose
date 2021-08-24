import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { HairMakeupProduct } from '../entities/hair-makeup-product.entity';
import { HairMakeupShop } from '../entities/hair-makeup-shop.entity';
import { GetStudioInput } from './get-studio.dto';

@InputType()
class UpdateHairMakeupProductPayload extends OmitType(
  HairMakeupProduct,
  ['id', 'createdAt', 'updatedAt', 'shop'],
  InputType,
) {}

@InputType()
class UpdateHairMakeupShopPayload extends OmitType(
  HairMakeupShop,
  ['id', 'createdAt', 'updatedAt', 'studio', 'products'],
  InputType,
) {
  @Field(type => [UpdateHairMakeupProductPayload])
  @ValidateNested({ each: true })
  @Type(() => UpdateHairMakeupProductPayload)
  products: UpdateHairMakeupProductPayload[];
}

@InputType()
export class UpdateHairMakeupShopsInput extends GetStudioInput {
  @Field(type => [UpdateHairMakeupShopPayload])
  @ValidateNested({ each: true })
  @Type(() => UpdateHairMakeupShopPayload)
  payload: UpdateHairMakeupShopPayload[];
}

@ObjectType()
export class UpdateHairMakeupShopsOutput extends CoreOutput {}
