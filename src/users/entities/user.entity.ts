import { hash, compare } from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { SocialAccount } from './social-account.entity';

export enum UserType {
  USER = 'USER',
  STUDIO = 'STUDIO',
  ADMIN = 'ADMIN',
}

registerEnumType(UserType, { name: 'Role' });

@Entity()
@ObjectType()
export class User extends CoreEntity {
  @Column({ type: 'enum', enum: UserType })
  @Field(type => UserType)
  @IsEnum(UserType)
  type: UserType;

  @Column({ unique: true })
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column({ nullable: true, select: false })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Column()
  @Field(type => Boolean)
  @IsBoolean()
  isVerified: boolean;

  @Column({ default: false })
  @Field(type => Boolean)
  @IsBoolean()
  isLocked: boolean;

  @Column()
  @Field(type => Date)
  @IsDate()
  lastLoginAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(relation => UserProfile, profile => profile.user)
  profile?: UserProfile;

  @OneToMany(relation => SocialAccount, account => account.user)
  socialAccounts: SocialAccount[];

  @BeforeInsert()
  @BeforeUpdate()
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
