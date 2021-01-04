import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catchphrase } from './entities/catchphrase.entity';
import { Studio } from './entities/studio.entity';
import { UserClickStudio } from './entities/user-click-studio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Studio, Catchphrase, UserClickStudio])],
})
export class StudiosModule {}
