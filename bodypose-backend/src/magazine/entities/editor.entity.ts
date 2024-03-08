import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class Editor extends CoreEntity {
  @Column({ length: 15 })
  @Field(type => String)
  @Length(1, 15)
  name: string;

  @Column({ length: 255 })
  @Field(type => String)
  @IsUrl()
  @Length(1, 255)
  logoUrl: string;

  @Column({ length: 20, nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @Length(1, 20)
  studioSlug?: string;
}
