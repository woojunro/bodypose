import { registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { LogEntity } from './log.entity';
import { User } from 'src/users/entities/user.entity';
import { Studio } from 'src/studios/entities/studio.entity';

export enum ViewSource {
  STUDIO_LIST = 'STUDIO_LIST',
  STUDIO_PHOTO = 'STUDIO_PHOTO',
  STUDIO_REVIEW = 'STUDIO_REVIEW',
  HOME = 'HOME',
  ETC = 'ETC',
}

registerEnumType(ViewSource, { name: 'ViewSource' });

@Entity()
export class LogStudioInfoView extends LogEntity {
  @Column({ type: 'varchar', length: 20 })
  source: ViewSource;

  @ManyToOne(relation => User, { nullable: true, onDelete: 'SET NULL' })
  user?: User;

  @ManyToOne(relation => Studio, { onDelete: 'CASCADE' })
  studio: Studio;
}
