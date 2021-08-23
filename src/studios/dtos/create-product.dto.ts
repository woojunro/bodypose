import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { HairMakeupProduct } from '../entities/hair-makeup-product.entity';
import { HairMakeupShop } from '../entities/hair-makeup-shop.entity';

@InputType()
class CreateHairMakeupProductPayload extends PickType(
  HairMakeupProduct,
  ['title', 'price'],
  InputType,
) {}

@InputType()
class CreateHairMakeupShopPayload extends PickType(
  HairMakeupShop,
  ['type', 'name', 'contactInfo', 'address', 'productListDescription'],
  InputType,
) {
  @Field(type => [CreateHairMakeupProductPayload])
  products: CreateHairMakeupProductPayload[];
}

@InputType()
export class CreateHairMakeupShopsInput {
  @Field(type => String)
  @IsString()
  studioSlug: string;

  @Field(type => [CreateHairMakeupShopPayload])
  shops: CreateHairMakeupShopPayload[];
}

@ObjectType()
export class CreateHairMakeupShopsOutput extends CoreOutput {}
