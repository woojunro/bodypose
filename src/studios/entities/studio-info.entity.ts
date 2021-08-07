import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class StudioInfo {
  @OneToOne(relation => Studio, studio => studio.info, { primary: true })
  @JoinColumn()
  studio: Studio;

  @UpdateDateColumn()
  @Field(type => Date)
  updatedAt: Date;

  // 문의 링크
  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  contactUrl?: string;

  // 예약 링크
  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  reservationUrl?: string;

  // 주중 가격 태그
  @Column({ length: 5, default: '평일' })
  @Field(type => String)
  @Length(1, 5)
  weekdayPriceTag: string;

  // 주말 가격 태그
  @Column({ length: 5, default: '주말' })
  @Field(type => String)
  @Length(1, 5)
  weekendPriceTag: string;

  // 스튜디오 촬영 상품 목록 설명 문구
  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  studioProduct?: string;

  // 야외 촬영 상품 목록 설명 문구
  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  outdoorProduct?: string;

  // 추가 상품 설명 문구
  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  additionalProduct?: string;

  // 스튜디오 소개 문구
  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  // 예약 방법 설명 문구
  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  reservation?: string;

  // 취소, 환불 정보 문구
  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  cancel?: string;
}
