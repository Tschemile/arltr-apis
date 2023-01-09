import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserToken } from 'apps/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'base';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities';
import { Any, Equal, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { CategoryService } from 'apps/settings';
import { HTTP_STATUS } from 'utils';
import { Address, AddressService } from 'apps/address';
import { QueryJobInput } from './dto/query-job.dto';

@Injectable()
export class JobsService extends BaseService<Job> {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @Inject(forwardRef(() => CategoryService)) private categoryService: CategoryService,
    @Inject(forwardRef(() => AddressService)) private addressService: AddressService,

  ) {
    super(jobRepository);
  }
  async create(createJobDto: CreateJobDto, user: UserToken) {
    const category = await this.categoryService.findOne({id: createJobDto.categoryId})

    if (!category) {
      return { status: HTTP_STATUS.Not_Found };
    }

    const createJob = this.jobRepository.create({
      ...createJobDto,
      address: {
        id: createJobDto.addressId,
      },
      employer: user.profile,
      category: {
        id: createJobDto.categoryId,
      },
    });

    await this.jobRepository.save(createJob);

    return {
      status: HTTP_STATUS.Created,
      job: createJob,
    };
  }

  async findAll(query: QueryJobInput) {
    const { search = '', type = '', limit: take = 10 } = query || {};

    const where: FindOptionsWhere<Job> = {
      id: query.jobIds ? Any([query.jobIds]) : Not(IsNull()),
      category: query.categoryIds ? Any([query.categoryIds]) : Not(IsNull()),
      type: type ? Equal(type) : Not(IsNull()),
    };

    const result = await this.jobRepository.findAndCount({
      relations: {
        address: true,
        category: true,
      },
      where,
      take,
    });

    const itemCount = result[1];
    return {
      jobs: result[0],
      total: itemCount,
    };
  }

  async findById(id: string) {
    const job = await this.jobRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!job) {
      return {
        status: HTTP_STATUS.Not_Found,
      };
    }
    return {
      status: HTTP_STATUS.OK,
      job,
    };
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.jobRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!job) {
      return {
        status: HTTP_STATUS.Not_Found,
      };
    }

    const category = await this.categoryService.findOne({id: updateJobDto.categoryId})

    if (!category) {
      return { status: HTTP_STATUS.Not_Found };
    }

    await this.jobRepository.save({
      ...updateJobDto,
      address: {
        id: updateJobDto.addressId,
      },
      category: {
        id: updateJobDto.categoryId,
      },
      id: job.id,
    });

    return {
      status: HTTP_STATUS.OK,
      job: { ...job, ...updateJobDto },
    };
  }

  async remove(id: string): Promise<boolean> {
    const where = { id: Equal(id) };
    const job = await this.jobRepository.findOne({
      relations: ['applicant'],
      where,
    });

    const removeJob = await this.jobRepository.remove(job);

    if (!removeJob) {
      return false;
    }
    return true;
  }
}
