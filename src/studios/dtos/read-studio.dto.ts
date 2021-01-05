import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
export class ReadStudioInput extends PickType(Studio, ['slug'], InputType) {}

@ObjectType()
export class ReadStudioOutput extends CoreOutput {
  @Field(type => Studio, { nullable: true })
  studio?: Studio;

  @Field(type => Boolean)
  isHearted?: boolean;
}

// name, catchphrases, address, slug, isHearted
// TODO: reviewScore, reviewCount, lowestPrice, event
@ObjectType()
export class StudioProfile extends PickType(
  Studio,
  ['name', 'slug', 'catchphrases', 'address'],
  ObjectType,
) {
  @Field(type => Boolean)
  isHearted: boolean;
}

@ObjectType()
export class ReadAllStudiosOutput extends CoreOutput {
  @Field(type => [StudioProfile], { nullable: true })
  studios?: StudioProfile[];
}
