import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioProduct } from '../entities/studio-product.entity';
import { GetStudioInput } from './get-studio.dto';

@InputType()
export class GetStudioProductsInput extends GetStudioInput {}

@ObjectType()
export class GetStudioProductsOutput extends CoreOutput {
  @Field(type => [StudioProduct], { nullable: true })
  studioProducts?: StudioProduct[];
}
