import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class AdditionalProduct extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(0)
  price: number;

  @ManyToOne(relation => Studio, studio => studio.additionalProducts, {
    onDelete: 'CASCADE',
  })
  @Field(type => Studio)
  studio: Studio;
}
