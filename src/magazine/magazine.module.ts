import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ENTITIES from './entities/entities';
import { MagazineResolver } from './magazine.resolver';
import { MagazineService } from './magazine.service';

@Module({
  imports: [TypeOrmModule.forFeature([...ENTITIES])],
  providers: [MagazineResolver, MagazineService],
})
export class MagazineModule {}
