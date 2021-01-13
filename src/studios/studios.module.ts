import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catchphrase } from './entities/catchphrase.entity';
import { Studio } from './entities/studio.entity';
import { UsersClickStudios } from './entities/users-click-studios.entity';
import { StudiosService } from './studios.service';
import { ProductResolver, StudiosResolver } from './studios.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Studio, Catchphrase, UsersClickStudios, Product]),
    AuthModule,
    forwardRef(() => UsersModule),
  ],
  providers: [StudiosService, StudiosResolver, ProductResolver],
  exports: [StudiosService],
})
export class StudiosModule {}
