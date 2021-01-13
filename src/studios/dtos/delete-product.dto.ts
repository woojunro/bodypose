import { InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UpdateProductInput } from './update-product.dto';

@InputType()
export class DeleteProductInput extends OmitType(UpdateProductInput, [
  'payload',
]) {}

@ObjectType()
export class DeleteProductOutput extends CoreOutput {}
