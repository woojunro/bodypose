import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  CreateProductInput,
  CreateProductOutput,
} from './dtos/create-product.dto';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import {
  DeleteProductInput,
  DeleteProductOutput,
} from './dtos/delete-product.dto';
import {
  GetStudioProductsInput,
  GetStudioProductsOutput,
} from './dtos/get-product.dto';
import {
  GetAllStudiosOutput,
  GetStudioInput,
  GetStudioOutput,
} from './dtos/get-studio.dto';
import {
  ToggleHeartStudioInput,
  ToggleHeartStudioOutput,
} from './dtos/toggle-heart-studio.dto';
import {
  UpdateProductInput,
  UpdateProductOutput,
} from './dtos/update-product.dto';
import { Catchphrase } from './entities/catchphrase.entity';
import { Product } from './entities/product.entity';
import { Studio } from './entities/studio.entity';
import { UsersClickStudios } from './entities/users-click-studios.entity';

@Injectable()
export class StudiosService {
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
    @InjectRepository(Catchphrase)
    private readonly catchphraseRepository: Repository<Catchphrase>,
    @InjectRepository(UsersClickStudios)
    private readonly userClickStudioRepository: Repository<UsersClickStudios>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  getStudioById(id: number): Promise<Studio> {
    return this.studioRepository.findOne(
      { id },
      { relations: ['catchphrases'] },
    );
  }

  getStudioBySlug(slug: string): Promise<Studio> {
    return this.studioRepository.findOne(
      { slug },
      { relations: ['catchphrases'] },
    );
  }

  async createStudio({
    catchphrases,
    ...input
  }: CreateStudioInput): Promise<CreateStudioOutput> {
    try {
      // Check duplicate studioSlug
      const studioBySlug = await this.getStudioBySlug(input.slug);
      if (studioBySlug) {
        return {
          ok: false,
          error: `Studio with that slug(${input.slug}) already exists`,
        };
      }
      // Create studio
      const newStudio = this.studioRepository.create({ ...input });
      // Add catchphrases
      if (catchphrases) {
        const catchphraseArray: Catchphrase[] = [];
        for (let i = 0; i < catchphrases.length && i < 2; i++) {
          const newCatchphrase = this.catchphraseRepository.create();
          newCatchphrase.phrase = catchphrases[i];
          await this.catchphraseRepository.save(newCatchphrase);
          catchphraseArray.push(newCatchphrase);
        }
        newStudio.catchphrases = catchphraseArray;
      } else {
        newStudio.catchphrases = [];
      }
      // Save
      const savedStudio = await this.studioRepository.save(newStudio);
      return {
        ok: true,
        studio: savedStudio,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async getStudio(
    user: User,
    { slug }: GetStudioInput,
  ): Promise<GetStudioOutput> {
    try {
      let heartStudios: Studio[] = [];
      // If logged in
      if (user) {
        const { studios } = await this.usersService.getMyHeartStudios(user);
        if (studios) {
          heartStudios = [...studios];
        }
      }
      const studio = await this.getStudioBySlug(slug);
      if (!studio) {
        return {
          ok: false,
          error: 'Studio not found',
        };
      }
      // Click
      const newClick = this.userClickStudioRepository.create({
        studio,
        user: user ? user : null,
      });
      await this.userClickStudioRepository.save(newClick);
      studio.clickCount += 1;
      await this.studioRepository.save(studio);
      // Return
      return {
        ok: true,
        studio: {
          ...studio,
          isHearted: heartStudios.some(
            heartStudio => heartStudio.slug === slug,
          ),
        },
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async getAllStudios(user: User): Promise<GetAllStudiosOutput> {
    try {
      let heartStudios: Studio[] = [];
      // If logged in
      if (user) {
        const { studios } = await this.usersService.getMyHeartStudios(user);
        if (studios) {
          heartStudios = [...studios];
        }
      }
      const studios = await this.studioRepository.find({
        relations: ['catchphrases'],
      });
      if (!studios) {
        throw new InternalServerErrorException();
      }
      return {
        ok: true,
        studios: studios.map(studio => ({
          ...studio,
          isHearted: heartStudios.some(
            heartStudio => heartStudio.slug === studio.slug,
          ),
        })),
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async toggleHeartStudio(
    { id }: User,
    { slug }: ToggleHeartStudioInput,
  ): Promise<ToggleHeartStudioOutput> {
    try {
      const studio = await this.getStudioBySlug(slug);
      if (!studio) {
        return {
          ok: false,
          error: 'Studio not found',
        };
      }
      const user = await this.usersService.getUserById(id, {
        relations: ['heartStudios'],
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      // If the studio exists in heartStudios, filter it
      // Update heartCount
      let exists = false;
      for (let i = 0; i < user.heartStudios.length; i++) {
        if (user.heartStudios[i].slug === slug) {
          exists = true;
          user.heartStudios.splice(i, 1);
          studio.heartCount -= 1;
          break;
        }
      }
      // If not, push it
      if (!exists) {
        user.heartStudios.push(studio);
        studio.heartCount += 1;
      }
      // Save
      await this.usersService.updateUser(user);
      const updatedStudio = await this.studioRepository.save(studio);
      return {
        ok: true,
        heartCount: updatedStudio.heartCount,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async createProduct({
    studioSlug,
    ...input
  }: CreateProductInput): Promise<CreateProductOutput> {
    try {
      // Find studio
      const studio = await this.getStudioBySlug(studioSlug);
      if (!studio) {
        return {
          ok: false,
          error: `Studio with slug(${studioSlug}) not found`,
        };
      }
      // Create and save product
      const newProduct = this.productRepository.create({ ...input });
      newProduct.studio = studio;
      const { id: productId } = await this.productRepository.save(newProduct);
      // return id
      return {
        ok: true,
        productId,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async getStudioProducts({
    slug,
  }: GetStudioProductsInput): Promise<GetStudioProductsOutput> {
    try {
      // Find products with slug
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.studio', 'studio')
        .where('studio.slug = :slug', { slug })
        .getMany();
      // If the array is empty, return error
      if (products.length === 0) {
        return {
          ok: false,
          error: `Studio with slug(${slug}) not found`,
        };
      }
      // Return products
      return {
        ok: true,
        products,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async updateProduct({
    slug,
    productId,
    payload,
  }: UpdateProductInput): Promise<UpdateProductOutput> {
    try {
      // Find product
      const product = await this.productRepository.findOne(
        { id: productId },
        {
          relations: ['studio'],
        },
      );
      if (!product) {
        return {
          ok: false,
          error: `Product with id(${productId}) not found`,
        };
      }
      // Check studio
      if (product.studio.slug !== slug) {
        return {
          ok: false,
          error: `Studio with slug(${slug}) does not have this product`,
        };
      }
      // Update and save
      const updatedProduct = { ...product, ...payload };
      await this.productRepository.save(updatedProduct);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async deleteProduct({
    slug,
    productId,
  }: DeleteProductInput): Promise<DeleteProductOutput> {
    try {
      // Find product
      const product = await this.productRepository.findOne(
        { id: productId },
        {
          relations: ['studio'],
        },
      );
      if (!product) {
        return {
          ok: false,
          error: `Product with id(${productId}) not found`,
        };
      }
      // Check studio
      if (product.studio.slug !== slug) {
        return {
          ok: false,
          error: `Studio with slug(${slug}) does not have this product`,
        };
      }
      // Delete
      await this.productRepository.delete({ id: productId });
      return { ok: true };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }
}
