import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
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
import { Product } from './product.entity';
import { UsersReviewStudios } from './users-review-studios.entity';

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

  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
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

  @OneToMany(relation => Catchphrase, catchphrase => catchphrase.studio)
  @Field(type => [Catchphrase])
  catchphrases: Catchphrase[];

  @ManyToMany(relation => User)
  @Field(type => [User])
  heartUsers: User[];

  @Column({ default: 0 })
  @Field(type => Int)
  heartCount: number;

  @Column({ default: 0 })
  @Field(type => Int)
  clickCount: number;

  @OneToMany(relation => StudioPhoto, photo => photo.studio)
  @Field(type => [StudioPhoto])
  photos: StudioPhoto[];

  @OneToMany(relation => Product, product => product.studio)
  @Field(type => [Product])
  products: Product[];

  @OneToMany(relation => UsersReviewStudios, review => review.studio)
  @Field(type => [UsersReviewStudios])
  reviews: UsersReviewStudios[];
}
