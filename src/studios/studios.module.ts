import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catchphrase } from './entities/catchphrase.entity';
import { Studio } from './entities/studio.entity';
import { UserClickStudio } from './entities/user-click-studio.entity';
import { StudiosService } from './studios.service';
import { StudiosResolver } from './studios.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Studio, Catchphrase, UserClickStudio]),
    AuthModule,
    UsersModule,
  ],
  providers: [StudiosService, StudiosResolver],
})
export class StudiosModule {}
