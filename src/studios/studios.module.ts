import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catchphrase } from './entities/catchphrase.entity';
import { Studio } from './entities/studio.entity';
import { StudiosService } from './studios.service';
import {
  ProductResolver,
  StudioReviewResolver,
  StudiosResolver,
  UsersHeartStudiosResolver,
} from './studios.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { StudioProduct } from './entities/studio-product.entity';
import { UsersReviewStudios } from './entities/users-review-studios.entity';
import { Branch } from './entities/branch.entity';
import { HairMakeupProduct } from './entities/hair-makeup-product.entity';
import { AdditionalProduct } from './entities/additional-product.entity';
import { PhotosModule } from 'src/photos/photos.module';
import { HairMakeupShop } from './entities/hair-makeup-shop.entity';
import { UsersHeartStudios } from './entities/users-heart-studios.entity';
import { UsersReportStudioReviews } from './entities/users-report-studio-reviews.entity';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Studio,
      Catchphrase,
      Branch,
      StudioProduct,
      HairMakeupShop,
      HairMakeupProduct,
      AdditionalProduct,
      UsersReviewStudios,
      UsersHeartStudios,
      UsersReportStudioReviews,
    ]),
    AuthModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PhotosModule),
    forwardRef(() => UploadsModule),
  ],
  providers: [
    StudiosService,
    StudiosResolver,
    ProductResolver,
    UsersHeartStudiosResolver,
    StudioReviewResolver,
  ],
  exports: [StudiosService],
})
export class StudiosModule {}
