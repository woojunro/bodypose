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
import { SponsoredProduct } from '../entities/sponsored-product.entity';
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
class CreateSponsoredProductsPayload extends PickType(
  SponsoredProduct,
  ['title', 'normalPrice', 'sponsoredPrice'],
  InputType,
) {}

@InputType()
export class CreateSponsoredProductsInput {
  @Field(type => String)
  @IsString()
  studioSlug: string;

  @Field(type => [CreateSponsoredProductsPayload])
  products: CreateSponsoredProductsPayload[];
}

@ObjectType()
export class CreateProductsOutput extends CoreOutput {
  @Field(type => [Int], { nullable: true })
  idList?: number[];
}
