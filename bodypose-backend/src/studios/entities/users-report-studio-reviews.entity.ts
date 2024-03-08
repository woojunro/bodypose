import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersReviewStudios } from './users-review-studios.entity';

export enum ReportStudioReviewReason {
  IDENTITY_THEFT = 'IDENTITY_THEFT', // 초상권 침해 및 무단도용
  FAKE_CONTENT = 'FAKE_CONTENT', // 거짓 정보
  LIBEL_INSULT = 'LIBEL_INSULT', // 비방 또는 모욕
  UNRELATED_CONTENT = 'UNRELATED_CONTENT', // 리뷰와 무관한 사진 및 글
  THE_OTHERS = 'THE_OTHERS', // 기타
}

registerEnumType(ReportStudioReviewReason, {
  name: 'ReportStudioReviewReason',
});

@Entity()
@ObjectType()
export class UsersReportStudioReviews extends CoreEntity {
  @ManyToOne(relation => User, { nullable: true, onDelete: 'SET NULL' })
  user: User;

  @ManyToOne(relation => UsersReviewStudios, { onDelete: 'CASCADE' })
  studioReview: UsersReviewStudios;

  @Column({ type: 'enum', enum: ReportStudioReviewReason })
  @Field(type => ReportStudioReviewReason)
  @IsEnum(ReportStudioReviewReason)
  reason: ReportStudioReviewReason;

  @Column()
  @Field(type => String)
  @IsString()
  detail: string;
}
