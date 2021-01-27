import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { HairMakeupProduct } from './hair-makeup-product.entity';
import { Studio } from './studio.entity';

export enum ShopType {
  SPONSORED = 'SPONSORED', // 제휴
  VISIT = 'VISIT', // 출장 방문
  OWNED = 'OWNED', // 스튜디오 자체
}

registerEnumType(ShopType, {
  name: 'ShopType',
});

@Entity()
@ObjectType()
export class HairMakeupShop extends CoreEntity {
  @Column({
    type: 'enum',
    enum: ShopType,
  })
  @Field(type => ShopType)
  @IsEnum(ShopType)
  type: ShopType;

  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  productListDescription?: string;

  @OneToMany(relation => HairMakeupProduct, product => product.shop)
  @Field(type => [HairMakeupProduct])
  products: HairMakeupProduct[];

  @ManyToOne(relation => Studio, studio => studio.hairMakeupShops, {
    onDelete: 'CASCADE',
  })
  @Field(type => Studio)
  studio: Studio;
}
