import { hash, compare } from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Studio } from 'src/studios/entities/studio.entity';
import { StudioPhoto } from 'src/photos/entities/studio-photo.entity';
import { UsersReviewStudios } from 'src/studios/entities/users-review-studios.entity';

export enum LoginMethod {
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Role {
  USER = 'USER',
  STUDIO = 'STUDIO',
  ADMIN = 'ADMIN',
}

registerEnumType(LoginMethod, {
  name: 'LoginMethod',
});

registerEnumType(Gender, {
  name: 'Gender',
});

registerEnumType(Role, {
  name: 'Role',
});

@Entity()
@ObjectType()
export class User extends CoreEntity {
  @Column({
    type: 'enum',
    enum: Role,
  })
  @Field(type => Role)
  @IsEnum(Role)
  role: Role;

  @Column({
    type: 'enum',
    enum: LoginMethod,
  })
  @Field(type => LoginMethod)
  @IsEnum(LoginMethod)
  loginMethod: LoginMethod;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  socialId?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Column({
    nullable: true,
    select: false,
  })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Column({ unique: true })
  @Field(type => String)
  @IsString()
  nickname: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  @Field(type => Gender, { nullable: true })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @Column()
  @Field(type => Boolean)
  @IsBoolean()
  isVerified: boolean;

  @ManyToMany(relation => Studio, studio => studio.heartUsers)
  @JoinTable({
    name: 'users_heart_studios',
  })
  @Field(type => [Studio])
  heartStudios: Studio[];

  @ManyToMany(relation => StudioPhoto, photo => photo.heartUsers)
  @JoinTable({
    name: 'users_heart_studio_photos',
  })
  @Field(type => [StudioPhoto])
  heartStudioPhotos: StudioPhoto[];

  @OneToMany(relation => UsersReviewStudios, review => review.user)
  @Field(type => [UsersReviewStudios])
  reviews: UsersReviewStudios[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    if (this.password) {
      try {
        const isCorrect = await compare(password, this.password);
        return isCorrect;
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
    return false;
  }
}
