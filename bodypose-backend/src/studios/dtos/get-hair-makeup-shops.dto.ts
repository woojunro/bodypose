import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { HairMakeupShop } from '../entities/hair-makeup-shop.entity';
import { GetStudioInput } from './get-studio.dto';

@InputType()
export class GetHairMakeupShopsInput extends GetStudioInput {}

@ObjectType()
export class GetHairMakeupShopsOutput extends CoreOutput {
  @Field(type => [HairMakeupShop], { nullable: true })
  hairMakeupShops?: HairMakeupShop[];
}
