import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class UserProfile extends CoreEntity {
  @OneToOne(relation => User, user => user.profile)
  user: User;

  @Column({ length: 10, unique: true })
  @Field(type => String)
  @IsString()
  @Length(2, 10)
  nickname: string;

  @Column({ nullable: true })
  @Field(type => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isMale?: boolean;

  @Column({ length: 255, nullable: true })
  @Field(type => String, { nullable: true })
  profileImageUrl?: string;
}
