import { Field, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum LoginWith {
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

registerEnumType(LoginWith, {
  name: 'LoginWith',
});

registerEnumType(Gender, {
  name: 'Gender',
});

@Entity()
export class User extends CoreEntity {
  @Column({
    type: 'enum',
    enum: LoginWith,
  })
  @Field(type => LoginWith)
  @IsEnum(LoginWith)
  createdWith: LoginWith;

  @Column({ nullable: true })
  @Field(type => String)
  @IsString()
  socialId: string;

  @Column({ nullable: true })
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column({
    nullable: true,
    select: false,
  })
  @Field(type => String)
  @IsString()
  password: string;

  @Column({
    nullable: true,
    unique: true,
  })
  @Field(type => String)
  @IsString()
  nickname: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  @Field(type => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Column({ nullable: true })
  @Field(type => String)
  @IsString()
  profileImageUrl: string;
}
