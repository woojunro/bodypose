import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { StudioPhoto } from 'src/photos/entities/studio-photo.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Catchphrase } from './catchphrase.entity';

export enum PremiumTier {
  NORMAL = 'NORMAL',
  PREMIUM = 'PREMIUM',
  SUPER_PREMIUM = 'SUPER_PREMIUM',
}

registerEnumType(PremiumTier, {
  name: 'PremiumTier',
});

@Entity()
@ObjectType()
export class Studio extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column({ unique: true })
  @Field(type => String)
  @IsString()
  slug: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsString()
  description?: string;

  @Column()
  @Field(type => String)
  @IsUrl()
  contactUrl: string;

  @Column()
  @Field(type => String)
  @IsUrl()
  reservationUrl: string;

  @Column()
  @Field(type => String)
  @IsString()
  address: string;

  @Column({
    type: 'enum',
    enum: PremiumTier,
    default: PremiumTier.NORMAL,
  })
  @Field(type => PremiumTier)
  @IsEnum(PremiumTier)
  premiumTier: PremiumTier;

  @OneToMany(type => Catchphrase, catchphrase => catchphrase.studio)
  @Field(type => [Catchphrase])
  catchphrases: Catchphrase[];

  @ManyToMany(type => User)
  @Field(type => [User])
  heartUsers: User[];

  @Column({ default: 0 })
  @Field(type => Int)
  heartCount: number;

  @Column({ default: 0 })
  @Field(type => Int)
  clickCount: number;

  @OneToMany(type => StudioPhoto, photo => photo.studio)
  @Field(type => [StudioPhoto])
  photos: StudioPhoto[];
}
