import { InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  CreateAdditionalProductsInput,
  CreateHairMakeupShopsInput,
  CreateProductsOutput,
  CreateStudioProductsInput,
} from './create-product.dto';

@InputType()
export class UpdateStudioProductsInput extends CreateStudioProductsInput {}

@InputType()
export class UpdateAdditionalProductsInput extends CreateAdditionalProductsInput {}

@InputType()
export class UpdateHairMakeupShopsInput extends CreateHairMakeupShopsInput {}

@ObjectType()
export class UpdateProductsOutput extends CreateProductsOutput {}

@ObjectType()
export class UpdateHairMakeupShopsOutput extends CoreOutput {}
