import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, Length, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { HairMakeupShop } from './hair-makeup-shop.entity';

@Entity()
@ObjectType()
export class HairMakeupProduct extends CoreEntity {
  @Column({ length: 50 })
  @Field(type => String)
  @Length(1, 50)
  title: string;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ManyToOne(relation => HairMakeupShop, shop => shop.products, {
    onDelete: 'CASCADE',
  })
  shop: HairMakeupShop;
}
