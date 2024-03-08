import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AdditionalProduct } from '../entities/additional-product.entity';
import { GetStudioInput } from './get-studio.dto';

@InputType()
class UpdateAdditionalProductPayload extends OmitType(
  AdditionalProduct,
  ['id', 'createdAt', 'updatedAt', 'studio'],
  InputType,
) {}

@InputType()
export class UpdateAdditionalProductsInput extends GetStudioInput {
  @Field(type => [UpdateAdditionalProductPayload])
  @ValidateNested({ each: true })
  @Type(() => UpdateAdditionalProductPayload)
  payload: UpdateAdditionalProductPayload[];
}

@ObjectType()
export class UpdateAdditionalProductsOutput extends CoreOutput {}
