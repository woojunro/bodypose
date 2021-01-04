import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catchphrase } from './entities/catchphrase.entity';
import { Studio } from './entities/studio.entity';
import { UserClickStudio } from './entities/user-click-studio.entity';
import { StudiosService } from './studios.service';
import { StudiosResolver } from './studios.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Studio, Catchphrase, UserClickStudio])],
  providers: [StudiosService, StudiosResolver],
})
export class StudiosModule {}
