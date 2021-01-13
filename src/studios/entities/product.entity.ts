import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class Product extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column()
  @Field(type => String)
  @IsString()
  subTitle: string;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(1)
  cutCount: number;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(1)
  timeMinute: number;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column()
  @Field(type => Int)
  @IsInt()
  weekdayPrice: number;

  @Column()
  @Field(type => Int)
  @IsInt()
  weekendPrice: number;

  @ManyToOne(relation => Studio, studio => studio.products, {
    onDelete: 'CASCADE',
  })
  @Field(type => Studio)
  studio: Studio;
}
