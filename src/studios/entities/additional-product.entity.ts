import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, Length, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class AdditionalProduct extends CoreEntity {
  @Column({ length: 50 })
  @Field(type => String)
  @Length(1, 50)
  title: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @Length(0, 255)
  description?: string;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ManyToOne(relation => Studio, studio => studio.additionalProducts, {
    onDelete: 'CASCADE',
  })
  studio: Studio;
}
