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
  CreateBranchInput,
  CreateBranchOutput,
} from './dtos/create-branch.dto';
import {
  CreateStudioProductsInput,
  CreateProductsOutput,
  CreateSponsoredProductsInput,
} from './dtos/create-product.dto';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import { GetProductsInput, GetProductsOutput } from './dtos/get-product.dto';
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
  UpdateBranchInput,
  UpdateBranchOutput,
} from './dtos/update-branch.dto';
import {
  UpdateStudioProductsInput,
  UpdateProductsOutput,
  UpdateSponsoredProductsInput,
} from './dtos/update-product.dto';
import {
  UpdateStudioInput,
  UpdateStudioOutput,
} from './dtos/update-studio.dto';
import { Branch } from './entities/branch.entity';
import { SponsoredProduct } from './entities/sponsored-product.entity';
import { StudioProduct } from './entities/studio-product.entity';
import { Studio } from './entities/studio.entity';

@Injectable()
export class StudiosService {
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
    @InjectRepository(StudioProduct)
    private readonly studioProductRepository: Repository<StudioProduct>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(SponsoredProduct)
    private readonly sponsoredProductRepository: Repository<SponsoredProduct>,
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
      let heartedStudio: Studio;
      if (user) {
        heartedStudio = await this.studioRepository
          .createQueryBuilder('studio')
          .leftJoinAndSelect('studio.heartUsers', 'user')
          .where({ slug })
          .andWhere('user.id = :userId', { userId: user.id })
          .getOne();
      }
      // Click
      /*
      const newClick = this.userClickStudioRepository.create({
        studio,
        user: user ? user : null,
      });
      await this.userClickStudioRepository.save(newClick);
      */
      // Return
      return {
        ok: true,
        studio: {
          ...studio,
          isHearted: Boolean(user) && Boolean(heartedStudio),
        },
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
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

  async toggleHeartStudio(
    { id }: User,
    { slug }: ToggleHeartStudioInput,
  ): Promise<ToggleHeartStudioOutput> {
    try {
      const studio = await this.studioRepository.findOne({ slug });
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }

      const isStudioAlreadyHearted = await this.studioRepository
        .createQueryBuilder('studio')
        .leftJoinAndSelect('studio.heartUsers', 'user')
        .where({ slug })
        .andWhere('user.id = :userId', { userId: id })
        .getOne();
      const relationQuery = this.studioRepository
        .createQueryBuilder('studio')
        .relation('heartUsers')
        .of(studio);
      if (isStudioAlreadyHearted) {
        await relationQuery.remove({ id });
        studio.heartCount--;
      } else {
        await relationQuery.add({ id });
        studio.heartCount++;
      }
      // Save
      await this.studioRepository.save(studio);
      return {
        ok: true,
        isHearted: !isStudioAlreadyHearted,
      };
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
        { relations: ['products', 'sponsoredProducts'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // return
      const { products: studioProducts, sponsoredProducts } = studio;
      return {
        ok: true,
        studioProducts,
        sponsoredProducts,
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
      for (const product of products) {
        const newProduct = this.studioProductRepository.create({ ...product });
        newProduct.studio = studio;
        const { id } = await this.studioProductRepository.save(newProduct);
        idList.push(id);
      }
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
        { relations: ['products'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // Overwrite
      const { products: currentProducts } = studio;
      const idList: number[] = [];
      for (let i = 0; i < currentProducts.length && i < products.length; i++) {
        currentProducts[i] = { ...currentProducts[i], ...products[i] };
        const { id } = await this.studioProductRepository.save(
          currentProducts[i],
        );
        idList.push(id);
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
          const { id } = await this.studioProductRepository.save(newProduct);
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

  async createSponsoredProducts({
    studioSlug,
    products,
  }: CreateSponsoredProductsInput): Promise<CreateProductsOutput> {
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
        const newProduct = this.sponsoredProductRepository.create({
          ...product,
        });
        newProduct.studio = studio;
        const { id } = await this.sponsoredProductRepository.save(newProduct);
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

  async updateSponsoredProducts({
    studioSlug,
    products,
  }: UpdateSponsoredProductsInput): Promise<UpdateProductsOutput> {
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
        { relations: ['sponsoredProducts'] },
      );
      if (!studio) {
        return {
          ok: false,
          error: 'STUDIO_NOT_FOUND',
        };
      }
      // Overwrite
      const { sponsoredProducts: currentProducts } = studio;
      const idList: number[] = [];
      for (let i = 0; i < currentProducts.length && i < products.length; i++) {
        currentProducts[i] = { ...currentProducts[i], ...products[i] };
        const { id } = await this.sponsoredProductRepository.save(
          currentProducts[i],
        );
        idList.push(id);
      }
      if (currentProducts.length > products.length) {
        // Delete products that haven't been updated
        for (let i = products.length; i < currentProducts.length; i++) {
          await this.sponsoredProductRepository.delete({
            id: currentProducts[i].id,
          });
        }
      } else if (currentProducts.length < products.length) {
        // Add more products
        for (let i = currentProducts.length; i < products.length; i++) {
          const newProduct = this.sponsoredProductRepository.create({
            ...products[i],
          });
          newProduct.studio = studio;
          const { id } = await this.sponsoredProductRepository.save(newProduct);
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
}
