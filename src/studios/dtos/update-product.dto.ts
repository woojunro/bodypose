import {
  Field,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateProductInput } from './create-product.dto';
import { GetStudioProductsInput } from './get-product.dto';

@InputType()
class UpdateProductPayload extends PartialType(
  OmitType(CreateProductInput, ['studioSlug']),
) {}

@InputType()
export class UpdateProductInput extends GetStudioProductsInput {
  @Field(type => Int)
  @IsInt()
  productId: number;

  @Field(type => UpdateProductPayload)
  payload: UpdateProductPayload;
}

@ObjectType()
export class UpdateProductOutput extends CoreOutput {}
