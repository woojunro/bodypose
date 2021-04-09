import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudiosModule } from 'src/studios/studios.module';
import { UsersModule } from 'src/users/users.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => StudiosModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
