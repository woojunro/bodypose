import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ReviewPhoto } from 'src/photos/entities/review-photo.entity';
import { PhotosService } from 'src/photos/photos.service';
import { UploadsService } from 'src/uploads/uploads.service';
import { UserType, User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  AssignStudioPartnerInput,
  AssignStudioPartnerOutput,
} from './dtos/assign-studio-partner.dto';
import { ClickStudioReviewInput } from './dtos/click-studio-review.dto';
import {
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
import { GetMyStudiosOutput } from './dtos/get-my-studios.dto';
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
  ReportStudioReviewInput,
  ReportStudioReviewOutput,
} from './dtos/report-studio-review.dto';
import {
  UpdateBranchesInput,
  UpdateBranchesOutput,
} from './dtos/update-branch.dto';
import {
  UpdateProductsOutput,
  UpdateAdditionalProductsInput,
  UpdateHairMakeupShopsInput,
  UpdateHairMakeupShopsOutput,
} from './dtos/update-product.dto';
import {
  UpdateStudioInfoInput,
  UpdateStudioInfoOutput,
} from './dtos/update-studio-info.dto';
import {
  UpdateStudioProductsInput,
  UpdateStudioProductsOutput,
} from './dtos/update-studio-product.dto';
import {
  UpdateStudioInput,
  UpdateStudioOutput,
} from './dtos/update-studio.dto';
import { AdditionalProduct } from './entities/additional-product.entity';
import { Branch } from './entities/branch.entity';
import { HairMakeupProduct } from './entities/hair-makeup-product.entity';
import { HairMakeupShop } from './entities/hair-makeup-shop.entity';
import { StudioInfo } from './entities/studio-info.entity';
import { StudioProduct } from './entities/studio-product.entity';
import { Studio } from './entities/studio.entity';
import { UsersHeartStudios } from './entities/users-heart-studios.entity';
import { UsersReportStudioReviews } from './entities/users-report-studio-reviews.entity';
import { UsersReviewStudios } from './entities/users-review-studios.entity';

@Injectable()
export class StudiosService {
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
    @InjectRepository(StudioInfo)
    private readonly studioInfoRepository: Repository<StudioInfo>,
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
    @InjectRepository(UsersHeartStudios)
    private readonly usersHeartStudiosRepository: Repository<UsersHeartStudios>,
    @InjectRepository(UsersReportStudioReviews)
    private readonly usersReportStudioReviewsRepository: Repository<UsersReportStudioReviews>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
    @Inject(forwardRef(() => UploadsService))
    private readonly uploadsService: UploadsService,
  ) {}

  async checkIfStudioExistsById(id: number): Promise<boolean> {
    const studio = await this.studioRepository.findOne(id, { select: ['id'] });
    return studio ? true : false;
  }

  checkIfStudioExistsBySlug(slug: string): Promise<Studio> {
    return this.studioRepository.findOne(
      { slug },
      { select: ['id', 'name', 'slug'] },
    );
  }

  getStudioBySlug(slug: string): Promise<Studio> {
    return this.studioRepository.findOne({ slug });
  }

  checkIfSlugIsValid(slug: string): boolean {
    return /^[a-z0-9](-?[a-z0-9])*$/g.test(slug);
  }

  async createStudio({
    name,
    slug,
  }: CreateStudioInput): Promise<CreateStudioOutput> {
    try {
      const isValid = this.checkIfSlugIsValid(slug);
      if (!isValid) return CommonError('INVALID_SLUG');
      // Check duplicate studioSlug
      const existingStudio = await this.checkIfStudioExistsBySlug(slug);
      if (existingStudio) return CommonError('DUPLICATE_SLUG');
      // Create studio
      const newStudio = this.studioRepository.create({ name, slug });
      // Insert into studio table
      const studio = await this.studioRepository.save(newStudio);
      // Create studioInfo
      const newInfo = this.studioInfoRepository.create({ studio });
      const info = await this.studioInfoRepository.save(newInfo);
      // return
      studio.info = info;
      return {
        ok: true,
        studio,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async assignStudioPartner({
    studioSlug,
    partnerEmail,
  }: AssignStudioPartnerInput): Promise<AssignStudioPartnerOutput> {
    try {
      const studio = await this.getStudioBySlug(studioSlug);
      if (!studio) return CommonError('STUDIO_NOT_FOUND');
      const partner = await this.usersService.getPartnerByEmail(partnerEmail);
      if (!partner) return CommonError('PARTNER_NOT_FOUND');
      // Assign partner and save
      studio.partner = partner;
      await this.studioRepository.save(studio);
      // Unlock partner user
      const { id } = partner.user;
      await this.usersService.lockUser({ id, isLocked: false });
      return { ok: true };
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
      let query = await this.studioRepository
        .createQueryBuilder('studio')
        .leftJoinAndSelect('studio.branches', 'branch')
        .leftJoinAndSelect('studio.info', 'info')
        .leftJoin('studio.partner', 'partner')
        .where('studio.slug = :slug', { slug });
      switch (user?.type) {
        case UserType.ADMIN:
          break;
        case UserType.STUDIO:
          query = query.andWhere('partner.userId = :id', { id: user.id });
          break;
        default:
          query = query.andWhere('studio.isPublic = true');
          break;
      }
      const studio = await query.getOne();
      if (!studio) return CommonError('STUDIO_NOT_FOUND');
      // If USER, check isHearted
      let isHearted: boolean = null;
      if (user?.type === UserType.USER) {
        const heart = await this.usersHeartStudiosRepository.findOne({
          where: {
            user: user.id,
            studio: studio.id,
          },
        });
        isHearted = Boolean(heart);
      }
      return {
        ok: true,
        studio: { ...studio, isHearted },
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getAllStudios(user: User): Promise<GetStudiosOutput> {
    try {
      const studios = await this.studioRepository
        .createQueryBuilder('s')
        .leftJoin('s.branches', 'b')
        .addSelect(['b.name', 'b.address'])
        .where('s.isPublic = true')
        .getMany();
      let studiosWithIsHearted: StudioWithIsHearted[];
      if (user?.type === UserType.USER) {
        const hearts = await this.usersHeartStudiosRepository.find({ user });
        studiosWithIsHearted = studios.map(studio => ({
          ...studio,
          isHearted: hearts.some(heart => heart.studioId === studio.id),
        }));
      } else {
        studiosWithIsHearted = studios.map(studio => ({
          ...studio,
          isHearted: null,
        }));
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

  async getMyStudios(user: User): Promise<GetMyStudiosOutput> {
    try {
      let studios: Studio[];
      switch (user?.type) {
        case UserType.ADMIN:
          studios = await this.studioRepository.find();
          break;
        case UserType.STUDIO:
          studios = await this.studioRepository
            .createQueryBuilder('studio')
            .leftJoin('studio.partner', 'partner')
            .where('partner.userId = :id', { id: user.id })
            .getMany();
          break;
        default:
          studios = [];
          break;
      }
      return { ok: true, studios };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async checkIfUserIsAdminOrOwner(id: number, user: User): Promise<boolean> {
    switch (user?.type) {
      case UserType.ADMIN:
        return true;
      case UserType.STUDIO:
        const studio = await this.studioRepository
          .createQueryBuilder('s')
          .select('s.id')
          .leftJoin('s.partner', 'p')
          .where('s.id = :id', { id })
          .andWhere('p.userId = :userId', { userId: user.id })
          .getOne();
        return Boolean(studio);
      default:
        return false;
    }
  }

  async updateStudio(
    user: User,
    { slug, payload }: UpdateStudioInput,
  ): Promise<UpdateStudioOutput> {
    try {
      const studio = await this.studioRepository.findOne({ slug });
      if (!studio) return CommonError('STUDIO_NOT_FOUND');
      const valid = await this.checkIfUserIsAdminOrOwner(studio.id, user);
      if (!valid) return CommonError('FORBIDDEN');
      // Check slug
      if (payload.slug) {
        const isSlugValid = this.checkIfSlugIsValid(payload.slug);
        if (!isSlugValid) return CommonError('INVALID_SLUG');
        const existingStudio = await this.getStudioBySlug(payload.slug);
        if (existingStudio && existingStudio.id !== studio.id) {
          return CommonError('DUPLICATE_SLUG');
        }
      }
      // Update
      const studioToUpdate = { ...studio, ...payload };
      await this.studioRepository.save(studioToUpdate);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateStudioInfo(
    user: User,
    { slug, payload }: UpdateStudioInfoInput,
  ): Promise<UpdateStudioInfoOutput> {
    try {
      const studio = await this.studioRepository.findOne(
        { slug },
        { relations: ['info'] },
      );
      if (!studio) return CommonError('STUDIO_NOT_FOUND');
      const valid = await this.checkIfUserIsAdminOrOwner(studio.id, user);
      if (!valid) return CommonError('FORBIDDEN');
      const { info } = studio;
      const infoToUpdate = { ...info, ...payload, studio };
      await this.studioInfoRepository.save(infoToUpdate);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateBranches(
    user: User,
    { slug, payload }: UpdateBranchesInput,
  ): Promise<UpdateBranchesOutput> {
    try {
      const studio = await this.studioRepository.findOne(
        { slug },
        { relations: ['branches'] },
      );
      if (!studio) return CommonError('STUDIO_NOT_FOUND');
      const valid = await this.checkIfUserIsAdminOrOwner(studio.id, user);
      if (!valid) return CommonError('FORBIDDEN');
      const { branches } = studio;
      // Delete all existing branches
      const idsToDelete = branches.map(branch => branch.id);
      if (idsToDelete.length) await this.branchRepository.delete(idsToDelete);
      // Create new branches
      const newBranches = payload.map(branch => ({
        ...branch,
        studio,
      }));
      await this.branchRepository.insert(newBranches);
      return { ok: true };
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

  getLowestPrice(lowestPrice: number, product: StudioProduct): number {
    if (product.peopleCount !== product.maxPeopleCount) {
      return lowestPrice;
    }
    const { weekdayPrice, weekendPrice } = product;
    let ret = lowestPrice;
    for (const price of [weekdayPrice, weekendPrice]) {
      if (Number.isInteger(price) && price >= 0) {
        if (ret == null) ret = price;
        else if (price < ret) {
          ret = price;
        }
      }
    }
    return ret;
  }

  async updateStudioProducts(
    user: User,
    { slug, payload }: UpdateStudioProductsInput,
  ): Promise<UpdateStudioProductsOutput> {
    try {
      // Find studio
      const studio = await this.studioRepository.findOne(
        { slug },
        { relations: ['studioProducts'] },
      );
      if (!studio) return CommonError('STUDIO_NOT_FOUND');
      const valid = await this.checkIfUserIsAdminOrOwner(studio.id, user);
      if (!valid) return CommonError('FORBIDDEN');
      // Overwrite
      const { studioProducts: currentProducts } = studio;
      let lowestPrice: number = null;
      for (let i = 0; i < currentProducts.length && i < payload.length; i++) {
        const productToUpdate = { ...currentProducts[i], ...payload[i] };
        const product = await this.studioProductRepository.save(
          productToUpdate,
        );
        // Update lowestPrice
        lowestPrice = this.getLowestPrice(lowestPrice, product);
      }
      if (currentProducts.length > payload.length) {
        // Delete products that haven't been updated
        const idsToDelete: number[] = [];
        for (let i = payload.length; i < currentProducts.length; i++) {
          idsToDelete.push(currentProducts[i].id);
        }
        await this.studioProductRepository.delete(idsToDelete);
      } else if (currentProducts.length < payload.length) {
        // Add more products
        for (let i = currentProducts.length; i < payload.length; i++) {
          const newProduct = this.studioProductRepository.create({
            ...payload[i],
          });
          newProduct.studio = studio;
          const product = await this.studioProductRepository.save(newProduct);
          // Update lowestPrice
          lowestPrice = this.getLowestPrice(lowestPrice, product);
        }
      }
      // Update lowestPrice
      const studioToUpdate = this.studioRepository.create({
        id: studio.id,
        lowestPrice,
      });
      await this.studioRepository.save(studioToUpdate);
      return { ok: true };
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

  async getStudioReviews(
    user: User,
    { studioSlug, order, page }: GetStudioReviewsInput,
  ): Promise<GetStudioReviewsOutput> {
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
        .leftJoin('review.user', 'user')
        .addSelect(['user.id'])
        .withDeleted()
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('review.photos', 'photo')
        .where('studio.slug = :studioSlug', { studioSlug })
        .andWhere('studio.coverPhotoUrl IS NOT NULL')
        .orderBy(orderByQuery, isDesc ? 'DESC' : 'ASC')
        .skip((page - 1) * reviewsPerPage)
        .take(reviewsPerPage)
        .getManyAndCount();
      // Make photos empty if isPhotoForProof is true
      reviews.forEach(review => {
        if (user?.type !== UserType.ADMIN && review.isPhotoForProof) {
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

  async getAllStudioReviews(
    user: User,
    { page }: GetAllStudioReviewsInput,
  ): Promise<GetStudioReviewsOutput> {
    try {
      const reviewsPerPage = 5;
      const [reviews, count] = await this.studioReviewRepository
        .createQueryBuilder('review')
        .leftJoin('review.studio', 'studio')
        .addSelect('studio.name')
        .addSelect('studio.slug')
        .leftJoin('review.user', 'user')
        .addSelect(['user.id'])
        .withDeleted()
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('review.photos', 'photo')
        .where('studio.coverPhotoUrl IS NOT NULL')
        .orderBy('review.createdAt', 'DESC')
        .skip((page - 1) * reviewsPerPage)
        .take(reviewsPerPage)
        .getManyAndCount();
      reviews.forEach(review => {
        if (user?.type !== UserType.ADMIN && review.isPhotoForProof) {
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

  async getMyStudioReviews(user: User): Promise<GetStudioReviewsOutput> {
    try {
      const { id: userId } = user;
      const studioReviews = await this.studioReviewRepository
        .createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .addSelect(['user.id'])
        .withDeleted()
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoin('review.studio', 'studio')
        .addSelect('studio.name')
        .addSelect('studio.slug')
        .leftJoinAndSelect('review.photos', 'photo')
        .where('user.id = :userId', { userId })
        .andWhere('studio.coverPhotoUrl IS NOT NULL')
        .orderBy('review.createdAt', 'DESC')
        .getMany();
      studioReviews.forEach(review => {
        if (review.isPhotoForProof) {
          review.photos = [];
        }
      });
      return {
        ok: true,
        studioReviews,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async clickStudioReview({ id }: ClickStudioReviewInput): Promise<CoreOutput> {
    try {
      const review = await this.studioReviewRepository.findOne(id, {
        select: ['id'],
      });
      if (!review) return CommonError('STUDIO_REVIEW_NOT_FOUND');
      await this.studioReviewRepository
        .createQueryBuilder('review')
        .update(UsersReviewStudios)
        .where({ id })
        .set({ clickCount: () => 'clickCount + 1' })
        .execute();
      return { ok: true };
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
        { relations: ['user', 'studio', 'photos'] },
      );
      if (!review) {
        return {
          ok: false,
          error: 'STUDIO_REVIEW_NOT_FOUND',
        };
      }
      // Check if the user is admin or author
      if (user.type !== UserType.ADMIN && user.id !== review.user.id) {
        return {
          ok: false,
          error: 'UNAUTHORIZED',
        };
      }
      // Delete photos in storage
      for (const photo of review.photos) {
        const filename = photo.url.substring(
          photo.url.indexOf('review-photos'),
        );
        await this.uploadsService.deleteFile(filename);
      }
      // Delete and save
      const { studio } = review;
      studio.reviewCount--;
      studio.totalRating -= review.rating;
      await this.studioRepository.save(studio);
      await this.studioReviewRepository.delete({ id });
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async reportStudioReview(
    user: User,
    { studioReviewId, reason, detail }: ReportStudioReviewInput,
  ): Promise<ReportStudioReviewOutput> {
    try {
      const studioReview = await this.studioReviewRepository.findOne({
        id: studioReviewId,
      });
      if (!studioReview) {
        return {
          ok: false,
          error: 'STUDIO_REVIEW_NOT_FOUND',
        };
      }
      let isAlreadyReported;
      if (user) {
        isAlreadyReported = await this.usersReportStudioReviewsRepository.findOne(
          {
            studioReview: { id: studioReviewId },
            user: { id: user.id },
          },
        );
      } else {
        isAlreadyReported = await this.usersReportStudioReviewsRepository.findOne(
          {
            studioReview: { id: studioReviewId },
          },
        );
      }
      if (isAlreadyReported) {
        return {
          ok: false,
          error: 'ALREADY_REPORTED',
        };
      }
      await this.usersReportStudioReviewsRepository.save(
        this.usersReportStudioReviewsRepository.create({
          studioReview: { id: studioReviewId },
          user,
          reason,
          detail,
        }),
      );
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
        { select: ['id'] },
      );
      if (!studio) return CommonError('STUDIO_NOT_FOUND');
      // 이미 찜 되어 있는지 확인
      const isAlreadyHearted = await this.usersHeartStudiosRepository.findOne({
        where: {
          user: user.id,
          studio: studio.id,
        },
      });
      if (isAlreadyHearted) return CommonError('ALREADY_HEARTED');
      // 생성
      await this.usersHeartStudiosRepository.save(
        this.usersHeartStudiosRepository.create({
          user,
          studio,
        }),
      );
      // 스튜디오 heartCount 증가
      await this.studioRepository
        .createQueryBuilder('studio')
        .update(Studio)
        .where({ id: studio.id })
        .set({ heartCount: () => 'heartCount + 1' })
        .execute();
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
        { select: ['id'] },
      );
      if (!studio) return CommonError('STUDIO_NOT_FOUND');
      // 이미 찜 되어 있는지 확인
      const isAlreadyHearted = await this.usersHeartStudiosRepository.findOne({
        where: {
          user: user.id,
          studio: studio.id,
        },
      });
      if (!isAlreadyHearted) return CommonError('ALREADY_DISHEARTED');
      // 삭제
      await this.usersHeartStudiosRepository.delete({
        id: isAlreadyHearted.id,
      });
      // 스튜디오 heartCount 감소
      await this.studioRepository
        .createQueryBuilder('studio')
        .update(Studio)
        .where({ id: studio.id })
        .set({ heartCount: () => 'heartCount - 1' })
        .execute();
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getHeartStudios(user: User): Promise<GetStudiosOutput> {
    try {
      const heartStudios = await this.usersHeartStudiosRepository.find({
        relations: ['studio', 'studio.branches'],
        where: { user: user.id },
        order: { heartAt: 'DESC' },
      });
      const studios: StudioWithIsHearted[] = [];
      for (const heartStudio of heartStudios) {
        const { studio } = heartStudio;
        if (!studio.coverPhotoUrl) continue;
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
