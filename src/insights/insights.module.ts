import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosModule } from 'src/photos/photos.module';
import { InsightsResolver } from './insights.resolver';
import { InsightsService } from './insights.service';
import { LOG_ENTITIES } from 'src/common/constants/entity-list.constant';
import { StudiosModule } from 'src/studios/studios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([...LOG_ENTITIES]),
    forwardRef(() => PhotosModule),
    forwardRef(() => StudiosModule),
  ],
  providers: [InsightsResolver, InsightsService],
})
export class InsightsModule {}
