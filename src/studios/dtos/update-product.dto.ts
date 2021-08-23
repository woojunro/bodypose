import { InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateHairMakeupShopsInput } from './create-product.dto';

@InputType()
export class UpdateHairMakeupShopsInput extends CreateHairMakeupShopsInput {}

@ObjectType()
export class UpdateHairMakeupShopsOutput extends CoreOutput {}
