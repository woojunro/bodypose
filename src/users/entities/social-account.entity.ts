import { registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum SocialProvider {
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

registerEnumType(SocialProvider, { name: 'SocialProvider' });

@Entity()
export class SocialAccount extends CoreEntity {
  @ManyToOne(relation => User, user => user.socialAccounts)
  user: User;

  @Column({ type: 'enum', enum: SocialProvider })
  @IsEnum(SocialProvider)
  provider: SocialProvider;

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  socialId: string;
}
