import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Studio } from 'src/studios/entities/studio.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Partner extends CoreEntity {
  @Column({ unique: true, length: 190 })
  @Field(type => String)
  @IsEmail()
  @Length(5, 190)
  email: string;

  @Column({ length: 30 })
  @Field(type => String)
  @Length(2, 30)
  name: string;

  @Column({ length: 20 })
  @Field(type => String)
  @Length(8, 20)
  phoneNumber: string;

  @Column({ length: 30 })
  @Field(type => String)
  @Length(1, 30)
  instagram: string;

  @Column({ length: 15 })
  @Field(type => String)
  @Length(10, 15)
  businessNumber: string;

  @Column({ length: 15 })
  @Field(type => String)
  @Length(1, 15)
  reqStudioName: string;

  @OneToOne(relation => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(relation => Studio, studio => studio.partner)
  @Field(type => [Studio])
  studios: Studio[];
}
