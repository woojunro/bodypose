import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { StudioPhoto } from 'src/photos/entities/studio-photo.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AdditionalProduct } from './additional-product.entity';
import { Branch } from './branch.entity';
import { Catchphrase } from './catchphrase.entity';
import { HairMakeupShop } from './hair-makeup-shop.entity';
import { StudioProduct } from './studio-product.entity';
import { UsersReviewStudios } from './users-review-studios.entity';

export enum PremiumTier {
  NORMAL = 'NORMAL',
  PREMIUM = 'PREMIUM',
  SUPER_PREMIUM = 'SUPER_PREMIUM',
}

registerEnumType(PremiumTier, {
  name: 'PremiumTier',
});

@Entity()
@ObjectType()
export class Studio extends CoreEntity {
  // 스튜디오 이름
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  // slug (라우팅, 쿼리에 사용)
  @Column({ unique: true })
  @Field(type => String)
  @IsString()
  slug: string;

  // 스튜디오 로고
  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  // 스튜디오 커버 사진
  @OneToOne(relation => StudioPhoto, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @Field(type => StudioPhoto, { nullable: true })
  coverPhoto?: StudioPhoto;

  // 문의 링크
  @Column()
  @Field(type => String)
  @IsUrl()
  contactUrl: string;

  // 예약 링크
  @Column()
  @Field(type => String)
  @IsUrl()
  reservationUrl: string;

  // 지점별 주소
  @OneToMany(relation => Branch, branch => branch.studio)
  @Field(type => [Branch])
  branches: Branch[];

  // 프리미엄 단계 (추후 수익 구조)
  @Column({
    type: 'enum',
    enum: PremiumTier,
    default: PremiumTier.NORMAL,
  })
  @Field(type => PremiumTier)
  @IsEnum(PremiumTier)
  premiumTier: PremiumTier;

  // 캐치프레이즈 목록 (추후 스튜디오 측에서 직접 등록)
  @OneToMany(relation => Catchphrase, catchphrase => catchphrase.studio)
  @Field(type => [Catchphrase])
  catchphrases: Catchphrase[];

  // 찜한 유저 목록
  @ManyToMany(relation => User, user => user.heartStudios)
  @Field(type => [User])
  heartUsers: User[];

  // 찜한 유저 수
  @Column({ default: 0 })
  @Field(type => Int)
  heartCount: number;

  // 스튜디오 사진 목록
  @OneToMany(relation => StudioPhoto, photo => photo.studio)
  @Field(type => [StudioPhoto])
  photos: StudioPhoto[];

  // 스튜디오 평점 총합
  @Column({ default: 0 })
  @Field(type => Int)
  totalRating: number;

  // 스튜디오 리뷰 수
  // totalRating / reviewCount 로 평점 산출
  @Column({ default: 0 })
  @Field(type => Int)
  reviewCount: number;

  // 스튜디오 리뷰 목록
  @OneToMany(relation => UsersReviewStudios, review => review.studio)
  @Field(type => [UsersReviewStudios])
  reviews: UsersReviewStudios[];

  // 스튜디오 상품 (스튜디오 촬영, 야외 촬영) 목록
  @OneToMany(relation => StudioProduct, product => product.studio)
  @Field(type => [StudioProduct])
  studioProducts: StudioProduct[];

  // 스튜디오 촬영 상품 목록 설명 문구
  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  studioProductListDescription?: string;

  // 야외 촬영 상품 목록 설명 문구
  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  outdoorProductListDescription?: string;

  // 주중 가격 태그 (평일, 월-목 등등)
  @Column({ default: '평일' })
  @Field(type => String, { defaultValue: '평일' })
  @IsString()
  weekdayPriceTag: string;

  // 주말 가격 태그 (주말, 공휴일, 금-일 등등)
  @Column({ default: '주말' })
  @Field(type => String, { defaultValue: '주말' })
  @IsString()
  weekendPriceTag: string;

  // 헤어메이크업샵 목록
  @OneToMany(relation => HairMakeupShop, shop => shop.studio)
  @Field(type => [HairMakeupShop])
  hairMakeupShops: HairMakeupShop[];

  // 추가 상품 설명 문구
  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  additionalProductListDescription?: string;

  // 추가 상품 목록
  @OneToMany(relation => AdditionalProduct, product => product.studio)
  @Field(type => [AdditionalProduct])
  additionalProducts: AdditionalProduct[];
}
