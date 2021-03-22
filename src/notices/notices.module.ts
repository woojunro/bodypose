import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entity/notice.entity';
import { NoticesResolver } from './notices.resolver';
import { NoticesService } from './notices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  providers: [NoticesResolver, NoticesService],
})
export class NoticesModule {}
