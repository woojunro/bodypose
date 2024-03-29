import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NOTICES_SERVICE_ENTITIES } from 'src/common/constants/entity-list.constant';
import { NoticesResolver, PartnersNoticesResolver } from './notices.resolver';
import { NoticesService } from './notices.service';

@Module({
  imports: [TypeOrmModule.forFeature([...NOTICES_SERVICE_ENTITIES])],
  providers: [NoticesResolver, PartnersNoticesResolver, NoticesService],
})
export class NoticesModule {}
