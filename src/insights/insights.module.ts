import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosModule } from 'src/photos/photos.module';
import { InsightsResolver } from './insights.resolver';
import { InsightsService } from './insights.service';
import { StudiosModule } from 'src/studios/studios.module';
import { MagazineModule } from 'src/magazine/magazine.module';
import ENTITIES from './entities/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([...ENTITIES]),
    forwardRef(() => PhotosModule),
    forwardRef(() => StudiosModule),
    MagazineModule,
  ],
  providers: [InsightsResolver, InsightsService],
})
export class InsightsModule {}
