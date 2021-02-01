import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudiosModule } from 'src/studios/studios.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [ConfigModule, StudiosModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
