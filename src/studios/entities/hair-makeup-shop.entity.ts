import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
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

  @Column({ length: 20 })
  @Field(type => String)
  @Length(1, 20)
  name: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @Length(1, 255)
  contactInfo?: string;

  @Column({ length: 100, nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @Length(1, 100)
  address?: string;

  @Column({ type: 'text', nullable: true })
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
  studio: Studio;
}
