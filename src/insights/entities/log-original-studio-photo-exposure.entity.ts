import { StudioPhoto } from 'src/photos/entities/studio-photo.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { LogEntity } from './log.entity';

@Entity()
export class LogOriginalStudioPhotoExposure extends LogEntity {
  @ManyToOne(relation => User, { nullable: true, onDelete: 'SET NULL' })
  user?: User;

  @ManyToOne(relation => StudioPhoto, { onDelete: 'CASCADE' })
  studioPhoto: StudioPhoto;
}
