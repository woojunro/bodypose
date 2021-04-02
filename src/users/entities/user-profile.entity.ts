import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

registerEnumType(UserGender, { name: 'UserGender' });

@Entity()
@ObjectType()
export class UserProfile extends CoreEntity {
  @OneToOne(relation => User, user => user.profile, { onDelete: 'CASCADE' })
  user: User;

  @Column({ unique: true, length: 10 })
  @Field(type => String)
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  nickname: string;

  @Column({ type: 'enum', enum: UserGender, nullable: true })
  @Field(type => UserGender, { nullable: true })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;
}
