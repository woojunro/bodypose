import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @OneToOne(relation => User, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 36, nullable: true })
  token?: string;
}
