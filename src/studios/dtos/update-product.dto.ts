import { InputType, ObjectType } from '@nestjs/graphql';
import {
  CreateProductsOutput,
  CreateSponsoredProductsInput,
  CreateStudioProductsInput,
} from './create-product.dto';

@InputType()
export class UpdateStudioProductsInput extends CreateStudioProductsInput {}

@InputType()
export class UpdateSponsoredProductsInput extends CreateSponsoredProductsInput {}

@ObjectType()
export class UpdateProductsOutput extends CreateProductsOutput {}
