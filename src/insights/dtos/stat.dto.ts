import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export enum StatType {
  STUDIO_INFO_VIEW = 'STUDIO_INFO_VIEW',
  ORIGINAL_PHOTO_VIEW = 'ORIGINAL_PHOTO_VIEW',
  STUDIO_CONTACT = 'STUDIO_CONTACT',
  STUDIO_RESERVATION = 'STUDIO_RESERVATION',
}

registerEnumType(StatType, { name: 'StatType' });

@InputType()
export class GetStatsInput {
  @Field(type => String)
  @Length(1, 20)
  studioSlug: string;

  @Field(type => StatType)
  type: StatType;
}

@ObjectType()
export class Stat {
  @Field(type => Date)
  datetime: Date;

  @Field(type => Number)
  count: number;
}

@ObjectType()
export class GetStatsOutput extends CoreOutput {
  @Field(type => [Stat], { nullable: true })
  stats?: Stat[];
}
