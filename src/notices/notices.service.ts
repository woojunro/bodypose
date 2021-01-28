import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { Repository } from 'typeorm';
import {
  CreateNoticeInput,
  CreateNoticeOutput,
} from './dtos/create-notice.dto';
import { GetNoticesInput, GetNoticesOutput } from './dtos/get-notice.dto';
import { Notice } from './entity/notice.entity';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

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
}
