import { InputType, ObjectType } from '@nestjs/graphql';
import {
  CreateProductsOutput,
  CreateStudioProductsInput,
} from './create-product.dto';

@InputType()
export class UpdateStudioProductsInput extends CreateStudioProductsInput {}

@ObjectType()
export class UpdateProductsOutput extends CreateProductsOutput {}
