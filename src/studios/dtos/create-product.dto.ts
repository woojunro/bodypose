import { Field, InputType, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioProduct } from '../entities/studio-product.entity';

@InputType()
export class CreateProductInput extends OmitType(
  StudioProduct,
  ['id', 'createdAt', 'updatedAt', 'studio'],
  InputType,
) {
  @Field(type => String)
  @IsString()
  studioSlug: string;
}

@ObjectType()
export class CreateProductOutput extends CoreOutput {
  @Field(type => Int, { nullable: true })
  productId?: number;
}
