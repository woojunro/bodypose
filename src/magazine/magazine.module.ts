import { Module } from '@nestjs/common';
import { MagazineResolver } from './magazine.resolver';
import { MagazineService } from './magazine.service';

@Module({
  providers: [MagazineResolver, MagazineService],
})
export class MagazineModule {}
