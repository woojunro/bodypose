import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, Length, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AdditionalProduct } from './additional-product.entity';
import { Branch } from './branch.entity';
import { Catchphrase } from './catchphrase.entity';
import { HairMakeupShop } from './hair-makeup-shop.entity';
import { StudioInfo } from './studio-info.entity';
import { StudioProduct } from './studio-product.entity';

@Entity()
@ObjectType()
export class Studio extends CoreEntity {
  // 스튜디오 이름 (최대 15자)
  @Column({ length: 15 })
  @Field(type => String)
  @Length(1, 15)
  name: string;

  // slug (라우팅, 쿼리에 사용, 최대 20자)
  @Column({ length: 20, unique: true })
  @Field(type => String)
  @Length(1, 20)
  slug: string;

  // 프리미엄 단계
  @Column({ type: 'int' })
  @Field(type => Int)
  @IsInt()
  @Min(0)
  tier: number;

  // 스튜디오 로고
  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  logoUrl?: string;

  // 스튜디오 커버 사진
  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  coverPhotoUrl?: string;

  // 지점별 주소
  @OneToMany(relation => Branch, branch => branch.studio)
  @Field(type => [Branch])
  branches: Branch[];

  // 캐치프레이즈 목록
  @OneToMany(relation => Catchphrase, catchphrase => catchphrase.studio)
  @Field(type => [Catchphrase])
  catchphrases: Catchphrase[];

  // 찜한 유저 수
  @Column({ default: 0 })
  @Field(type => Int)
  heartCount: number;

  // 스튜디오 평점 총합
  @Column({ default: 0 })
  @Field(type => Int)
  totalRating: number;

  // 스튜디오 리뷰 수
  // totalRating / reviewCount 로 평점 산출
  @Column({ default: 0 })
  @Field(type => Int)
  reviewCount: number;

  // 스튜디오 상품 최저가
  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  @IsInt()
  @Min(0)
  lowestPrice?: number;

  // 스튜디오 정보
  @OneToOne(relation => StudioInfo, info => info.studio)
  @Field(type => StudioInfo)
  info: StudioInfo;

  // 스튜디오 상품 (스튜디오 촬영, 야외 촬영) 목록
  @OneToMany(relation => StudioProduct, product => product.studio)
  @Field(type => [StudioProduct])
  studioProducts: StudioProduct[];

  // 헤어메이크업샵 목록
  @OneToMany(relation => HairMakeupShop, shop => shop.studio)
  @Field(type => [HairMakeupShop])
  hairMakeupShops: HairMakeupShop[];

  // 추가 상품 목록
  @OneToMany(relation => AdditionalProduct, product => product.studio)
  @Field(type => [AdditionalProduct])
  additionalProducts: AdditionalProduct[];
}
