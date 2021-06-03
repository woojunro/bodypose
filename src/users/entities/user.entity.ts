import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { UserOauth } from './user-oauth.entity';

export enum UserType {
  USER = 'USER',
  STUDIO = 'STUDIO',
  ADMIN = 'ADMIN',
}

registerEnumType(UserType, { name: 'UserType' });

@Entity()
@ObjectType()
export class User extends CoreEntity {
  @Column({ length: 10 })
  @Field(type => UserType)
  type: UserType;

  @Column({ length: 190, unique: true })
  @Field(type => String)
  email: string;

  @Column({ length: 100, nullable: true })
  password?: string;

  @Column()
  @Field(type => Boolean)
  isVerified: boolean;

  @Column()
  isLocked: boolean;

  @Column({ type: 'datetime', nullable: true })
  @Field(type => Date)
  lastLoginAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(relation => UserProfile, profile => profile.user, {
    onDelete: 'SET NULL',
  })
  @Field(type => UserProfile, { nullable: true })
  @JoinColumn()
  profile?: UserProfile;

  @OneToMany(relation => UserOauth, oauth => oauth.user)
  @Field(type => [UserOauth])
  oauthList?: UserOauth[];
}
