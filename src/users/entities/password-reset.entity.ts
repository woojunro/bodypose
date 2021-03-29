import { v4 as uuidv4 } from 'uuid';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class PasswordReset extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsUUID()
  code: string;

  @OneToOne(type => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(type => User)
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
