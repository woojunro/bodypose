import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
export class GetStudioInput extends PickType(Studio, ['slug'], InputType) {}

@ObjectType()
export class StudioWithIsHearted extends Studio {
  @Field(type => Boolean)
  isHearted: boolean;
}

@ObjectType()
export class GetStudioOutput extends CoreOutput {
  @Field(type => StudioWithIsHearted, { nullable: true })
  studio?: StudioWithIsHearted;
}

@ObjectType()
export class GetStudiosOutput extends CoreOutput {
  @Field(type => [StudioWithIsHearted], { nullable: true })
  studios?: StudioWithIsHearted[];
}
