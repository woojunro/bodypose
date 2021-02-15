import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ReviewPhoto } from 'src/photos/entities/review-photo.entity';
import { PhotosService } from 'src/photos/photos.service';
import { Role, User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  CreateBranchInput,
  CreateBranchOutput,
} from './dtos/create-branch.dto';
import {
  CreateStudioProductsInput,
  CreateProductsOutput,
  CreateAdditionalProductsInput,
  CreateHairMakeupShopsInput,
  CreateHairMakeupShopsOutput,
} from './dtos/create-product.dto';
import {
  CreateStudioReviewInput,
  CreateStudioReviewOutput,
} from './dtos/create-studio-review.dto';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import {
  DeleteStudioReviewInput,
  DeleteStudioReviewOutput,
} from './dtos/delete-studio-review.dto';
import { GetProductsInput, GetProductsOutput } from './dtos/get-product.dto';
import {
  GetAllStudioReviewsInput,
  GetStudioReviewsInput,
  GetStudioReviewsOutput,
  StudioReviewOrder,
} from './dtos/get-studio-review.dto';
import {
  GetStudiosOutput,
  GetStudioInput,
  GetStudioOutput,
  StudioWithIsHearted,
} from './dtos/get-studio.dto';
import { HeartStudioInput, HeartStudioOutput } from './dtos/heart-studio.dto';
import {
  UpdateBranchInput,
  UpdateBranchOutput,
} from './dtos/update-branch.dto';
import {
  UpdateStudioProductsInput,
  UpdateProductsOutput,
  UpdateAdditionalProductsInput,
  UpdateHairMakeupShopsInput,
  UpdateHairMakeupShopsOutput,
} from './dtos/update-product.dto';
import {
  UpdateStudioInput,
  UpdateStudioOutput,
} from './dtos/update-studio.dto';
import { AdditionalProduct } from './entities/additional-product.entity';
import { Branch } from './entities/branch.entity';
import { HairMakeupProduct } from './entities/hair-makeup-product.entity';
import { HairMakeupShop } from './entities/hair-makeup-shop.entity';
import { StudioProduct } from './entities/studio-product.entity';
import { Studio } from './entities/studio.entity';
import { UsersClickStudios } from './entities/users-click-studios.entity';
import { UsersHeartStudios } from './entities/users-heart-studios.entity';
import { UsersReviewStudios } from './entities/users-review-studios.entity';

@Injectable()
export class StudiosService {
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
    @InjectRepository(StudioProduct)
    private readonly studioProductRepository: Repository<StudioProduct>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(HairMakeupShop)
    private readonly hairMakeupShopRepository: Repository<HairMakeupShop>,
    @InjectRepository(HairMakeupProduct)
    private readonly hairMakeupProductRepository: Repository<HairMakeupProduct>,
    @InjectRepository(AdditionalProduct)
    private readonly additionalProductRepository: Repository<AdditionalProduct>,
    @InjectRepository(UsersReviewStudios)
    private readonly studioReviewRepository: Repository<UsersReviewStudios>,
    @InjectRepository(UsersClickStudios)
    private readonly usersClickStudiosRepository: Repository<UsersClickStudios>,
    @InjectRepository(UsersHeartStudios)
    private readonly usersHeartStudiosRepository: Repository<UsersHeartStudios>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
  ) {}

  getStudioById(id: number): Promise<Studio> {
    return this.studioRepository.findOne(
      { id },
      { relations: ['catchphrases'] },
    );
  }

  checkIfStudioExists(slug: string): Promise<Studio> {
    return this.studioRepository.findOne(
      { slug },
      { select: ['id', 'name', 'slug'] },
    );
  }

  getStudioBySlug(slug: string): Promise<Studio> {
    return this.studioRepository.findOne(
      { slug },
      { relations: ['catchphrases'] },
    );
  }

  async createStudio(input: CreateStudioInput): Promise<CreateStudioOutput> {
    try {
      // Check duplicate studioSlug
      const studioBySlug = await this.getStudioBySlug(input.slug);
      if (studioBySlug) {
        return {
          ok: false,
          error: 'DUPLICATE_STUDIO_SLUG',
        };
      }
      // Create studio
      const newStudio = this.studioRepository.create({ ...input });
      // Save
      const savedStudio = await this.studioRepository.save(newStudio);
      return {
        ok: true,
        id: savedStudio.id,
        slug: savedStudio.slug,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getStudio(
    user: User,
    { slug }: GetStudioInput,
  ): Promise<GetStudioOutput> {
    try {
      const studio = await this.studioRepository.findOne(
        { slug },
        { relations: ['branches'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // If logged in, check isHearted
      let heart: UsersHeartStudios;
      if (user) {
        heart = await this.usersHeartStudiosRepository.findOne({
          where: {
            user: user.id,
            studio: studio.id,
          },
        });
      }
      // Click
      const newClick = this.usersClickStudiosRepository.create({
        studio,
        user: user ? user : null,
      });
      this.usersClickStudiosRepository.save(newClick);
      // Return
      return {
        ok: true,
        studio: {
          ...studio,
          isHearted: Boolean(user) && Boolean(heart),
        },
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getAllStudios(user: User): Promise<GetStudiosOutput> {
    try {
      const studios = await this.studioRepository.find({
        relations: ['branches', 'coverPhoto'],
        select: [
          'id',
          'name',
          'slug',
          'heartCount',
          'lowestPrice',
          'reviewCount',
          'totalRating',
          'premiumTier',
        ],
      });
      if (!studios) {
        throw new InternalServerErrorException();
      }
      let heartStudios: UsersHeartStudios[] = [];
      if (user) {
        heartStudios = await this.usersHeartStudiosRepository.find({
          where: { user: user.id },
        });
      }
      const studiosWithIsHearted: StudioWithIsHearted[] = [];
      for (const studio of studios) {
        studiosWithIsHearted.push({
          ...studio,
          isHearted: heartStudios.some(heart => heart.studioId === studio.id),
        });
      }
      return {
        ok: true,
        studios: studiosWithIsHearted,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateStudio({
    slug,
    payload,
  }: UpdateStudioInput): Promise<UpdateStudioOutput> {
    try {
      const studio = await this.studioRepository.findOne({ slug });
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      const updatedStudio = { ...studio, ...payload };
      await this.studioRepository.save(updatedStudio);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createBranches({
    studioSlug,
    payload: payloadList,
  }: CreateBranchInput): Promise<CreateBranchOutput> {
    try {
      if (payloadList.length === 0) {
        return {
          ok: false,
          error: 'INVALID_PAYLOAD_LENGTH',
        };
      }
      const studio = await this.studioRepository.findOne({ slug: studioSlug });
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      const idList: number[] = [];
      for (const payload of payloadList) {
        const newBranch = this.branchRepository.create({ ...payload });
        newBranch.studio = studio;
        const { id } = await this.branchRepository.save(newBranch);
        idList.push(id);
      }
      return {
        ok: true,
        idList,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateBranches({
    studioSlug,
    payload,
  }: UpdateBranchInput): Promise<UpdateBranchOutput> {
    try {
      if (payload.length === 0) {
        return {
          ok: false,
          error: 'INVALID_PAYLOAD_LENGTH',
        };
      }
      const studio = await this.studioRepository.findOne(
        { slug: studioSlug },
        { relations: ['branches'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      const { branches } = studio;
      const idList: number[] = [];
      // Overwrite
      for (let i = 0; i < branches.length && i < payload.length; i++) {
        const { name, address } = payload[i];
        branches[i].name = name;
        branches[i].address = address;
        const { id } = await this.branchRepository.save(branches[i]);
        idList.push(id);
      }
      if (branches.length > payload.length) {
        for (let i = payload.length; i < branches.length; i++) {
          await this.branchRepository.delete({ id: branches[i].id });
        }
      } else if (branches.length < payload.length) {
        for (let i = branches.length; i < payload.length; i++) {
          const newBranch = this.branchRepository.create({ ...payload[i] });
          newBranch.studio = studio;
          const { id } = await this.branchRepository.save(newBranch);
          idList.push(id);
        }
      }
      return {
        ok: true,
        idList,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getProducts({ slug }: GetProductsInput): Promise<GetProductsOutput> {
    try {
      // Find studio
      const studio = await this.studioRepository.findOne(
        { slug },
        {
          relations: [
            'studioProducts',
            'hairMakeupShops',
            'hairMakeupShops.products',
            'additionalProducts',
          ],
        },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // return
      const {
        studioProducts: studioProducts,
        hairMakeupShops,
        additionalProducts,
      } = studio;
      return {
        ok: true,
        studioProducts,
        hairMakeupShops,
        additionalProducts,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createStudioProducts({
    studioSlug,
    products,
  }: CreateStudioProductsInput): Promise<CreateProductsOutput> {
    try {
      if (products.length === 0) {
        return {
          ok: false,
          error: 'INVALID_PAYLOAD_LENGTH',
        };
      }
      // Find studio
      const studio = await this.studioRepository.findOne({ slug: studioSlug });
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // Create and save products
      const idList: number[] = [];
      let lowestPrice = 0;
      for (const product of products) {
        const newProduct = this.studioProductRepository.create({ ...product });
        newProduct.studio = studio;
        const { id, weekdayPrice } = await this.studioProductRepository.save(
          newProduct,
        );
        idList.push(id);
        if (lowestPrice === 0 || weekdayPrice < lowestPrice) {
          lowestPrice = weekdayPrice;
        }
      }
      // Update lowestPrice
      studio.lowestPrice = lowestPrice;
      await this.studioRepository.save(studio);
      // return idList
      return {
        ok: true,
        idList,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateStudioProducts({
    studioSlug,
    products,
  }: UpdateStudioProductsInput): Promise<UpdateProductsOutput> {
    try {
      if (products.length === 0) {
        return {
          ok: false,
          error: 'INVALID_PAYLOAD_LENGTH',
        };
      }
      // Find studio
      const studio = await this.studioRepository.findOne(
        { slug: studioSlug },
        { relations: ['studioProducts'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // Overwrite
      const { studioProducts: currentProducts } = studio;
      const idList: number[] = [];
      let lowestPrice = 0;
      for (let i = 0; i < currentProducts.length && i < products.length; i++) {
        currentProducts[i] = { ...currentProducts[i], ...products[i] };
        const { id, weekdayPrice } = await this.studioProductRepository.save(
          currentProducts[i],
        );
        idList.push(id);
        if (lowestPrice === 0 || weekdayPrice < lowestPrice) {
          lowestPrice = weekdayPrice;
        }
      }
      if (currentProducts.length > products.length) {
        // Delete products that haven't been updated
        for (let i = products.length; i < currentProducts.length; i++) {
          await this.studioProductRepository.delete({
            id: currentProducts[i].id,
          });
        }
      } else if (currentProducts.length < products.length) {
        // Add more products
        for (let i = currentProducts.length; i < products.length; i++) {
          const newProduct = this.studioProductRepository.create({
            ...products[i],
          });
          newProduct.studio = studio;
          const { id, weekdayPrice } = await this.studioProductRepository.save(
            newProduct,
          );
          idList.push(id);
          if (lowestPrice === 0 || weekdayPrice < lowestPrice) {
            lowestPrice = weekdayPrice;
          }
        }
      }
      // Update lowestPrice
      const { studioProducts, ...studioToUpdate } = studio;
      studioToUpdate.lowestPrice = lowestPrice;
      await this.studioRepository.save(studioToUpdate);
      return {
        ok: true,
        idList,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createAdditionalProducts({
    studioSlug,
    products,
  }: CreateAdditionalProductsInput): Promise<CreateProductsOutput> {
    try {
      if (products.length === 0) {
        return {
          ok: false,
          error: 'INVALID_PAYLOAD_LENGTH',
        };
      }
      // Find studio
      const studio = await this.studioRepository.findOne({ slug: studioSlug });
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // Create and save products
      const idList: number[] = [];
      for (const product of products) {
        const newProduct = this.additionalProductRepository.create({
          ...product,
        });
        newProduct.studio = studio;
        const { id } = await this.additionalProductRepository.save(newProduct);
        idList.push(id);
      }
      // Return idList
      return {
        ok: true,
        idList,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateAdditionalProducts({
    studioSlug,
    products,
  }: UpdateAdditionalProductsInput): Promise<UpdateProductsOutput> {
    try {
      let isDeletion = false;
      if (products.length === 0) {
        isDeletion = true;
      }
      // Find studio
      const studio = await this.studioRepository.findOne(
        { slug: studioSlug },
        { relations: ['additionalProducts'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // Delete
      if (isDeletion) {
        for (const product of studio.additionalProducts) {
          await this.additionalProductRepository.delete({ id: product.id });
        }
        return { ok: true };
      }
      // Overwrite
      const { additionalProducts: currentProducts } = studio;
      const idList: number[] = [];
      for (let i = 0; i < currentProducts.length && i < products.length; i++) {
        currentProducts[i] = { ...currentProducts[i], ...products[i] };
        const { id } = await this.additionalProductRepository.save(
          currentProducts[i],
        );
        idList.push(id);
      }
      if (currentProducts.length > products.length) {
        // Delete products that haven't been updated
        for (let i = products.length; i < currentProducts.length; i++) {
          await this.additionalProductRepository.delete({
            id: currentProducts[i].id,
          });
        }
      } else if (currentProducts.length < products.length) {
        // Add more products
        for (let i = currentProducts.length; i < products.length; i++) {
          const newProduct = this.additionalProductRepository.create({
            ...products[i],
          });
          newProduct.studio = studio;
          const { id } = await this.additionalProductRepository.save(
            newProduct,
          );
          idList.push(id);
        }
      }
      // return
      return {
        ok: true,
        idList,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createHairMakeupShops({
    studioSlug,
    shops,
  }: CreateHairMakeupShopsInput): Promise<CreateHairMakeupShopsOutput> {
    try {
      // Validate shops
      const INVALID_PAYLOAD_LENGTH = {
        ok: false,
        error: 'INVALID_PAYLOAD_LENGTH',
      };
      if (shops.length === 0) {
        return INVALID_PAYLOAD_LENGTH;
      }
      // Find studio
      const studio = await this.studioRepository.findOne(
        { slug: studioSlug },
        { relations: ['hairMakeupShops'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // Check if hairMakeupShops already exist
      if (studio.hairMakeupShops.length !== 0) {
        return {
          ok: false,
          error: 'HAIR_MAKEUP_SHOPS_ALREADY_EXIST',
        };
      }
      // Create and save shops and products
      for (const shop of shops) {
        const { products, ...shopInfo } = shop;
        const newShop = this.hairMakeupShopRepository.create({ ...shopInfo });
        newShop.studio = studio;
        const savedShop = await this.hairMakeupShopRepository.save(newShop);
        for (const product of products) {
          const newProduct = this.hairMakeupProductRepository.create({
            ...product,
          });
          newProduct.shop = savedShop;
          await this.hairMakeupProductRepository.save(newProduct);
        }
      }
      // return
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateHairMakeupShops({
    studioSlug,
    shops,
  }: UpdateHairMakeupShopsInput): Promise<UpdateHairMakeupShopsOutput> {
    try {
      let isDeletion = false;
      if (shops.length === 0) {
        isDeletion = true;
      }
      // Find studio
      const studio = await this.studioRepository.findOne(
        { slug: studioSlug },
        { relations: ['hairMakeupShops', 'hairMakeupShops.products'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // Delete all shops
      if (isDeletion) {
        for (const shop of studio.hairMakeupShops) {
          await this.hairMakeupShopRepository.delete({ id: shop.id });
        }
        return { ok: true };
      }
      // Overwrite shops
      for (
        let i = 0;
        i < shops.length && i < studio.hairMakeupShops.length;
        i++
      ) {
        const currentShop = studio.hairMakeupShops[i];
        const { products, ...shopInfo } = shops[i];
        const updatedShop = await this.hairMakeupShopRepository.save({
          ...currentShop,
          ...shopInfo,
        });
        // Overwrite products
        for (
          let j = 0;
          j < products.length && j < updatedShop.products.length;
          j++
        ) {
          const currentProduct = updatedShop.products[j];
          await this.hairMakeupProductRepository.save({
            ...currentProduct,
            ...products[j],
          });
        }
        if (updatedShop.products.length > products.length) {
          // Delete the rest products
          for (let j = products.length; j < updatedShop.products.length; j++) {
            await this.hairMakeupProductRepository.delete({
              id: updatedShop.products[j].id,
            });
          }
        } else if (updatedShop.products.length < products.length) {
          // Create new products
          for (let j = updatedShop.products.length; j < products.length; j++) {
            const newProduct = this.hairMakeupProductRepository.create({
              ...products[j],
            });
            newProduct.shop = updatedShop;
            await this.hairMakeupProductRepository.save(newProduct);
          }
        }
      }
      if (shops.length < studio.hairMakeupShops.length) {
        // Delete the rest shops
        for (let i = shops.length; i < studio.hairMakeupShops.length; i++) {
          await this.hairMakeupShopRepository.delete({
            id: studio.hairMakeupShops[i].id,
          });
        }
      } else if (shops.length > studio.hairMakeupShops.length) {
        // Create new shops
        for (let i = studio.hairMakeupShops.length; i < shops.length; i++) {
          const { products, ...shopInfo } = shops[i];
          const newShop = this.hairMakeupShopRepository.create({ ...shopInfo });
          newShop.studio = studio;
          const savedShop = await this.hairMakeupShopRepository.save(newShop);
          for (const product of products) {
            const newProduct = this.hairMakeupProductRepository.create({
              ...product,
            });
            newProduct.shop = savedShop;
            await this.hairMakeupProductRepository.save(newProduct);
          }
        }
      }
      // return
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createStudioReview(
    user: User,
    { studioSlug, payload }: CreateStudioReviewInput,
  ): Promise<CreateStudioReviewOutput> {
    try {
      // Check if the user is verified
      if (!user.isVerified) {
        return {
          ok: false,
          error: 'USER_NOT_VERIFIED',
        };
      }
      // Check validity of payload
      const {
        rating,
        text,
        isPhotoForProof,
        photoUrls,
        thumbnailIndex,
      } = payload;
      const INVALID_PAYLOAD: CoreOutput = {
        ok: false,
        error: 'INVALID_PAYLOAD',
      };
      if (rating < 1 || rating > 5) {
        return INVALID_PAYLOAD;
      }
      if (!Number.isInteger(rating)) {
        return INVALID_PAYLOAD;
      }
      if (text.length < 12) {
        return INVALID_PAYLOAD;
      }
      if (photoUrls.length < 1 || photoUrls.length > 3) {
        return INVALID_PAYLOAD;
      }
      if (thumbnailIndex < 0 || thumbnailIndex >= photoUrls.length) {
        return INVALID_PAYLOAD;
      }
      // Find studio
      const studio = await this.studioRepository.findOne({ slug: studioSlug });
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // Create review
      const newReview = this.studioReviewRepository.create({
        rating,
        text,
        isPhotoForProof,
      });
      newReview.user = user;
      newReview.studio = studio;
      // Create review photos
      const reviewPhotos: ReviewPhoto[] = [];
      for (const url of photoUrls) {
        const newReviewPhoto = await this.photosService.createReviewPhoto(url);
        reviewPhotos.push(newReviewPhoto);
      }
      newReview.photos = reviewPhotos;
      // Set thumbnail
      // If isPhotoForProof is true, set thumbnail to null
      newReview.thumbnailPhotoId = isPhotoForProof
        ? null
        : newReview.photos[thumbnailIndex].id;
      // Save
      await this.studioReviewRepository.save(newReview);
      studio.reviewCount++;
      studio.totalRating += rating;
      await this.studioRepository.save(studio);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getStudioReviews({
    studioSlug,
    order,
    page,
  }: GetStudioReviewsInput): Promise<GetStudioReviewsOutput> {
    try {
      const reviewsPerPage = 5;
      // Set query order
      let orderByQuery: string;
      let isDesc = true;
      switch (order) {
        case StudioReviewOrder.DATE:
          orderByQuery = 'review.createdAt';
          break;
        case StudioReviewOrder.RATING_ASC:
          orderByQuery = 'review.rating';
          isDesc = false;
          break;
        case StudioReviewOrder.RATING_DESC:
          orderByQuery = 'review.rating';
          break;
        default:
          return {
            ok: false,
            error: 'INVALID_ORDER',
          };
      }
      // Find reviews
      const [reviews, count] = await this.studioReviewRepository
        .createQueryBuilder('review')
        .leftJoin('review.studio', 'studio')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.photos', 'photo')
        .where('studio.slug = :studioSlug', { studioSlug })
        .orderBy(orderByQuery, isDesc ? 'DESC' : 'ASC')
        .skip((page - 1) * reviewsPerPage)
        .take(reviewsPerPage)
        .getManyAndCount();
      // Make photos empty if isPhotoForProof is true
      reviews.forEach(review => {
        if (review.isPhotoForProof) {
          review.photos = [];
        }
      });
      // return
      return {
        ok: true,
        studioReviews: reviews,
        totalPages: Math.ceil(count / reviewsPerPage),
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getAllStudioReviews({
    page,
  }: GetAllStudioReviewsInput): Promise<GetStudioReviewsOutput> {
    try {
      const reviewsPerPage = 5;
      const [reviews, count] = await this.studioReviewRepository
        .createQueryBuilder('review')
        .leftJoin('review.studio', 'studio')
        .addSelect('studio.name')
        .addSelect('studio.slug')
        .leftJoin('review.user', 'user')
        .addSelect('user.nickname')
        .leftJoinAndSelect('review.photos', 'photo')
        .orderBy('review.createdAt', 'DESC')
        .skip((page - 1) * reviewsPerPage)
        .take(reviewsPerPage)
        .getManyAndCount();
      reviews.forEach(review => {
        if (review.isPhotoForProof) {
          review.photos = [];
        }
      });
      return {
        ok: true,
        studioReviews: reviews,
        totalPages: Math.ceil(count / reviewsPerPage),
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async deleteStudioReview(
    user: User,
    { id }: DeleteStudioReviewInput,
  ): Promise<DeleteStudioReviewOutput> {
    try {
      // Find review
      const review = await this.studioReviewRepository.findOne(
        { id },
        { relations: ['user', 'studio'] },
      );
      if (!review) {
        return {
          ok: false,
          error: 'STUDIO_REVIEW_NOT_FOUND',
        };
      }
      // Check if the user is admin or author
      if (user.role !== Role.ADMIN && user.id !== review.user.id) {
        return {
          ok: false,
          error: 'UNAUTHORIZED',
        };
      }
      // Delete and save
      await this.studioReviewRepository.delete({ id });
      const { studio } = review;
      studio.reviewCount--;
      studio.totalRating -= review.rating;
      await this.studioRepository.save(studio);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async heartStudio(
    user: User,
    { slug }: HeartStudioInput,
  ): Promise<HeartStudioOutput> {
    try {
      // 스튜디오 존재 여부 확인
      const studio = await this.studioRepository.findOne(
        { slug },
        { select: ['id', 'heartCount'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // 이미 찜 되어 있는지 확인
      const isAlreadyHearted = await this.usersHeartStudiosRepository.findOne({
        where: {
          user: user.id,
          studio: studio.id,
        },
      });
      if (isAlreadyHearted) {
        return {
          ok: false,
          error: 'ALREADY_HEARTED',
        };
      }
      // 생성
      await this.usersHeartStudiosRepository.save(
        this.usersHeartStudiosRepository.create({
          user,
          studio,
        }),
      );
      // 스튜디오 heartCount 증가
      studio.heartCount++;
      await this.studioRepository.save(studio);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async disheartStudio(
    user: User,
    { slug }: HeartStudioInput,
  ): Promise<HeartStudioOutput> {
    try {
      // 스튜디오 존재 여부 확인
      const studio = await this.studioRepository.findOne(
        { slug },
        { select: ['id', 'heartCount'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // 이미 찜 되어 있는지 확인
      const isAlreadyHearted = await this.usersHeartStudiosRepository.findOne({
        where: {
          user: user.id,
          studio: studio.id,
        },
      });
      if (!isAlreadyHearted) {
        return {
          ok: false,
          error: 'ALREADY_DISHEARTED',
        };
      }
      // 삭제
      await this.usersHeartStudiosRepository.delete({
        id: isAlreadyHearted.id,
      });
      // 스튜디오 heartCount 감소
      studio.heartCount--;
      await this.studioRepository.save(studio);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getHeartStudios(user: User): Promise<GetStudiosOutput> {
    try {
      const heartStudios = await this.usersHeartStudiosRepository.find({
        relations: ['studio', 'studio.coverPhoto', 'studio.branches'],
        where: { user: user.id },
        order: { heartAt: 'DESC' },
      });
      const studios: StudioWithIsHearted[] = [];
      for (const heartStudio of heartStudios) {
        const { studio } = heartStudio;
        studios.push({
          ...studio,
          isHearted: true,
        });
      }
      return {
        ok: true,
        studios,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
