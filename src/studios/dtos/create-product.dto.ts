import {
  Field,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AdditionalProduct } from '../entities/additional-product.entity';
import { HairMakeupProduct } from '../entities/hair-makeup-product.entity';
import { HairMakeupShop } from '../entities/hair-makeup-shop.entity';
import { StudioProduct } from '../entities/studio-product.entity';

@InputType()
class CreateStudioProductPayload extends OmitType(
  StudioProduct,
  ['id', 'createdAt', 'updatedAt', 'studio'],
  InputType,
) {}

@InputType()
export class CreateStudioProductsInput {
  @Field(type => String)
  @IsString()
  studioSlug: string;

  @Field(type => [CreateStudioProductPayload])
  products: CreateStudioProductPayload[];
}

@InputType()
class CreateHairMakeupProductPayload extends PickType(
  HairMakeupProduct,
  ['title', 'price'],
  InputType,
) {}

@InputType()
class CreateHairMakeupShopPayload extends PickType(
  HairMakeupShop,
  ['type', 'name', 'contactInfo', 'productListDescription'],
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

@InputType()
class CreateAdditionalProductsPayload extends PickType(
  AdditionalProduct,
  ['title', 'description', 'price'],
  InputType,
) {}

@InputType()
export class CreateAdditionalProductsInput {
  @Field(type => String)
  @IsString()
  studioSlug: string;

  @Field(type => [CreateAdditionalProductsPayload])
  products: CreateAdditionalProductsPayload[];
}

@ObjectType()
export class CreateProductsOutput extends CoreOutput {
  @Field(type => [Int], { nullable: true })
  idList?: number[];
}

@ObjectType()
export class CreateHairMakeupShopsOutput extends CoreOutput {}
