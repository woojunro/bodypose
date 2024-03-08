import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AdditionalProduct } from '../entities/additional-product.entity';
import { GetStudioInput } from './get-studio.dto';

@InputType()
export class GetAdditionalProductsInput extends GetStudioInput {}

@ObjectType()
export class GetAdditionalProductsOutput extends CoreOutput {
  @Field(type => [AdditionalProduct], { nullable: true })
  additionalProducts?: AdditionalProduct[];
}
