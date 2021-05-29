import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class UserProfile extends CoreEntity {
  @OneToOne(relation => User, user => user.profile, { onDelete: 'SET NULL' })
  user: User;

  @Column({ length: 10, unique: true })
  @Field(type => String)
  @IsString()
  @Length(1, 10)
  nickname: string;

  @Column({ type: 'bit', nullable: true })
  @Field(type => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isMale?: boolean;

  @Column({ length: 255, nullable: true })
  @Field(type => String, { nullable: true })
  profileImageUrl?: string;
}
