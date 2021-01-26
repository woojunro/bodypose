import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catchphrase } from './entities/catchphrase.entity';
import { Studio } from './entities/studio.entity';
import { UsersClickStudios } from './entities/users-click-studios.entity';
import { StudiosService } from './studios.service';
import {
  ProductResolver,
  StudioReviewResolver,
  StudiosResolver,
} from './studios.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { StudioProduct } from './entities/studio-product.entity';
import { UsersReviewStudios } from './entities/users-review-studios.entity';
import { Branch } from './entities/branch.entity';
import { SponsoredProduct } from './entities/sponsored-product.entity';
import { AdditionalProduct } from './entities/additional-product.entity';
import { PhotosModule } from 'src/photos/photos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Studio,
      Catchphrase,
      Branch,
      UsersClickStudios,
      StudioProduct,
      SponsoredProduct,
      AdditionalProduct,
      UsersReviewStudios,
    ]),
    AuthModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PhotosModule),
  ],
  providers: [
    StudiosService,
    StudiosResolver,
    ProductResolver,
    StudioReviewResolver,
  ],
  exports: [StudiosService],
})
export class StudiosModule {}
