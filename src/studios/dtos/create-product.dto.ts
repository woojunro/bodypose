import { Field, InputType, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioProduct } from '../entities/studio-product.entity';

@InputType()
class CreateStudioProductPayload extends OmitType(
  StudioProduct,
  ['id', 'createdAt', 'updatedAt', 'studio'],
  InputType,
) {}

@InputType()
export class CreateStudioProductsInput {
  @Field(type => String)
  @IsString()
  studioSlug: string;

  @Field(type => [CreateStudioProductPayload])
  products: CreateStudioProductPayload[];
}

@ObjectType()
export class CreateProductsOutput extends CoreOutput {
  @Field(type => [Int], { nullable: true })
  idList?: number[];
}
