import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AdditionalProduct } from '../entities/additional-product.entity';
import { SponsoredProduct } from '../entities/sponsored-product.entity';
import { StudioProduct } from '../entities/studio-product.entity';
import { GetStudioInput } from './get-studio.dto';

@InputType()
export class GetProductsInput extends GetStudioInput {}

@ObjectType()
export class GetProductsOutput extends CoreOutput {
  @Field(type => [StudioProduct], { nullable: true })
  studioProducts?: StudioProduct[];

  @Field(type => [SponsoredProduct], { nullable: true })
  sponsoredProducts?: SponsoredProduct[];

  @Field(type => [AdditionalProduct], { nullable: true })
  additionalProducts?: AdditionalProduct[];
}
