import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioProduct } from '../entities/studio-product.entity';
import { GetStudioInput } from './get-studio.dto';

@InputType()
class UpdateStudioProductPayload extends OmitType(
  StudioProduct,
  ['id', 'createdAt', 'updatedAt', 'studio'],
  InputType,
) {}

@InputType()
export class UpdateStudioProductsInput extends GetStudioInput {
  @Field(type => [UpdateStudioProductPayload])
  @ValidateNested({ each: true })
  @Type(() => UpdateStudioProductPayload)
  payload: UpdateStudioProductPayload[];
}

@ObjectType()
export class UpdateStudioProductsOutput extends CoreOutput {}
