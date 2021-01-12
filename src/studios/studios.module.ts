import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catchphrase } from './entities/catchphrase.entity';
import { Studio } from './entities/studio.entity';
import { UsersClickStudios } from './entities/users-click-studios.entity';
import { StudiosService } from './studios.service';
import { StudiosResolver } from './studios.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Studio, Catchphrase, UsersClickStudios]),
    AuthModule,
    forwardRef(() => UsersModule),
  ],
  providers: [StudiosService, StudiosResolver],
  exports: [StudiosService],
})
export class StudiosModule {}
