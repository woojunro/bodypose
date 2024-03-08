import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum OAuthProvider {
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

registerEnumType(OAuthProvider, { name: 'OAuthProvider' });

@Entity()
@ObjectType()
@Index(['provider', 'socialId'], { unique: true })
export class UserOauth extends CoreEntity {
  @ManyToOne(relation => User, user => user.oauthList, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ length: 10 })
  @Field(type => OAuthProvider)
  @IsEnum(OAuthProvider)
  provider: OAuthProvider;

  @Column({ length: 100 })
  @IsString()
  @Length(1, 100)
  socialId: string;
}
