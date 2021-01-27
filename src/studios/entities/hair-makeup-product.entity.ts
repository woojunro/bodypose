import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { HairMakeupShop } from './hair-makeup-shop.entity';

@Entity()
@ObjectType()
export class HairMakeupProduct extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
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
  @Field(type => HairMakeupShop)
  shop: HairMakeupShop;
}
