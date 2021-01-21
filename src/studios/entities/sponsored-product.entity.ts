import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class SponsoredProduct extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(0)
  normalPrice: number;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(0)
  sponsoredPrice: number;

  @ManyToOne(relation => Studio, studio => studio.sponsoredProducts, {
    onDelete: 'CASCADE',
  })
  @Field(type => Studio)
  studio: Studio;
}
