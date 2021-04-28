import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosModule } from 'src/photos/photos.module';
import { LogOriginalStudioPhotoExposure } from './entities/log-original-studio-photo-exposure.entity';
import { InsightsResolver } from './insights.resolver';
import { InsightsService } from './insights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogOriginalStudioPhotoExposure]),
    forwardRef(() => PhotosModule),
  ],
  providers: [InsightsResolver, InsightsService],
})
export class InsightsModule {}
