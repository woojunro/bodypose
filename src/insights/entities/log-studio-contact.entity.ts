import { Studio } from 'src/studios/entities/studio.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { LogEntity } from './log.entity';

@Entity()
export class LogStudioContact extends LogEntity {
  @ManyToOne(relation => User, { nullable: true, onDelete: 'SET NULL' })
  user?: User;

  @ManyToOne(relation => Studio, { onDelete: 'CASCADE' })
  studio: Studio;
}
