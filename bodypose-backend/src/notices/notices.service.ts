import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Repository } from 'typeorm';
import {
  CreateNoticeInput,
  CreateNoticeOutput,
} from './dtos/create-notice.dto';
import {
  DeleteNoticeInput,
  DeleteNoticeOutput,
} from './dtos/delete-notice.dto';
import {
  GetNoticeInput,
  GetNoticeOutput,
  GetNoticesInput,
  GetNoticesOutput,
} from './dtos/get-notice.dto';
import {
  CreatePartnersNoticeInput,
  GetPartnersNoticeInput,
  GetPartnersNoticeOutput,
  GetPartnersNoticesInput,
  GetPartnersNoticesOutput,
  UpdatePartnersNoticeInput,
} from './dtos/partners-notice.dto';
import {
  UpdateNoticeInput,
  UpdateNoticeOutput,
} from './dtos/update-notice.dto';
import { Notice } from './entity/notice.entity';
import { PartnersNotice } from './entity/partners-notice.entity';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    @InjectRepository(PartnersNotice)
    private readonly partnersNoticeRepository: Repository<PartnersNotice>,
  ) {}

  private readonly NOTICE_NOT_FOUND: CoreOutput = {
    ok: false,
    error: 'NOTICE_NOT_FOUND',
  };

  async createNotice({
    title,
    content,
  }: CreateNoticeInput): Promise<CreateNoticeOutput> {
    try {
      const newNotice = await this.noticeRepository.save(
        this.noticeRepository.create({ title, content }),
      );
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getNotices({ page }: GetNoticesInput): Promise<GetNoticesOutput> {
    try {
      const noticesPerPage = 8;
      const [notices, count] = await this.noticeRepository.findAndCount({
        select: ['id', 'updatedAt', 'title'],
        order: { updatedAt: 'DESC' },
        skip: (page - 1) * noticesPerPage,
        take: noticesPerPage,
      });
      return {
        ok: true,
        notices,
        totalPages: Math.ceil(count / noticesPerPage),
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getNotice({ id }: GetNoticeInput): Promise<GetNoticeOutput> {
    try {
      const notice = await this.noticeRepository.findOne({ id });
      if (!notice) {
        return this.NOTICE_NOT_FOUND;
      }
      return {
        ok: true,
        notice,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateNotice({
    id,
    payload,
  }: UpdateNoticeInput): Promise<UpdateNoticeOutput> {
    try {
      const notice = await this.noticeRepository.findOne({ id });
      if (!notice) {
        return this.NOTICE_NOT_FOUND;
      }
      const noticeToBeUpdated = { ...notice, ...payload };
      await this.noticeRepository.save(noticeToBeUpdated);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async deleteNotice({ id }: DeleteNoticeInput): Promise<DeleteNoticeOutput> {
    try {
      const notice = await this.noticeRepository.findOne({ id });
      if (!notice) {
        return this.NOTICE_NOT_FOUND;
      }
      await this.noticeRepository.delete({ id });
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createPartnersNotice(
    input: CreatePartnersNoticeInput,
  ): Promise<CoreOutput> {
    try {
      const newNotice = this.partnersNoticeRepository.create({ ...input });
      await this.partnersNoticeRepository.save(newNotice);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getPartnersNotices({
    page,
  }: GetPartnersNoticesInput): Promise<GetPartnersNoticesOutput> {
    try {
      const noticesPerPage = 5;
      const [
        partnersNotices,
        count,
      ] = await this.partnersNoticeRepository.findAndCount({
        select: ['id', 'updatedAt', 'title'],
        order: { updatedAt: 'DESC' },
        skip: (page - 1) * noticesPerPage,
        take: noticesPerPage,
      });
      return {
        ok: true,
        partnersNotices,
        totalPages: Math.ceil(count / noticesPerPage),
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getPartnersNotice({
    id,
  }: GetPartnersNoticeInput): Promise<GetPartnersNoticeOutput> {
    try {
      const notice = await this.partnersNoticeRepository.findOne(id);
      if (!notice) return this.NOTICE_NOT_FOUND;
      return { ok: true, partnersNotice: notice };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updatePartnersNotice(
    input: UpdatePartnersNoticeInput,
  ): Promise<CoreOutput> {
    try {
      const notice = await this.partnersNoticeRepository.findOne(input.id);
      if (!notice) return this.NOTICE_NOT_FOUND;
      const noticeToBeUpdated = this.partnersNoticeRepository.create({
        ...input,
      });
      await this.partnersNoticeRepository.save(noticeToBeUpdated);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async deletePartnersNotice({
    id,
  }: GetPartnersNoticeInput): Promise<CoreOutput> {
    try {
      const notice = await this.partnersNoticeRepository.findOne(id);
      if (!notice) return this.NOTICE_NOT_FOUND;
      await this.partnersNoticeRepository.delete(id);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
