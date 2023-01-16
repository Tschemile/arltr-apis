import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressService } from 'apps/address';
import { UserToken } from 'apps/auth';
import { QueryJobInput, UpdateJobDto } from 'apps/jobs/dtos';
import { CategoryService } from 'apps/settings';
import { BaseError, BaseService } from 'base';
import {
  Any,
  Equal,
  FindOptionsWhere,
  IsNull,
  LessThanOrEqual,
  Not,
  Repository
} from 'typeorm';
import { TableName } from 'utils';
import { CreateJobDto } from '../../dtos/job/create-job.dto';
import { Job } from '../../entities';

export const jobRelation = {
  address: true,
  category: true,
  employer: true,
};

@Injectable()
export class JobsService extends BaseService<Job> {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    @Inject(forwardRef(() => AddressService))
    private addressService: AddressService,
  ) {
    super(jobRepository, jobRelation);
  }
  async create(createJobDto: CreateJobDto, user: UserToken) {
    console.log(user);

    const category = await this.categoryService.findOne({
      id: createJobDto.categoryId,
    });

    if (!category) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }

    const address = await this.addressService.findOne({
      id: createJobDto.addressId,
    });

    if (!address) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
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
      job: createJob,
    };
  }

  async findAll(query: QueryJobInput) {
    const { search = '', type = '', limit = 10 } = query || {};

    const where: FindOptionsWhere<Job> = {
      id: query.jobIds ? Any([query.jobIds]) : Not(IsNull()),
      category: query.categoryIds ? Any([query.categoryIds]) : Not(IsNull()),
      type: type ? Equal(type) : Not(IsNull()),
      expiredAt: LessThanOrEqual(new Date()),
    };

    const { data: jobs, total } = await this.find({
      where,
      limit,
    });

    return {
      jobs,
      total,
    };
  }

  async findById(id: string) {
    const job = await this.jobRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!job) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }
    return {
      job,
    };
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: UserToken) {
    const job = await this.jobRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!job) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }

    if (job.employer.id !== user.profile.id) {
      BaseError(TableName.ADDRESS, HttpStatus.FORBIDDEN);
    }

    const category = await this.categoryService.findOne({
      id: updateJobDto.categoryId,
    });

    if (!category) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }

    const address = await this.addressService.findOne({
      id: updateJobDto.addressId,
    });

    if (!address) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }

    await this.jobRepository.save({
      ...updateJobDto,
      address,
      category,
      id: job.id,
    });

    return {
      job: { ...job, ...updateJobDto },
    };
  }

  async remove(id: string, user: UserToken) {
    const job = await this.findOne({ id });

    if (!job) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }

    if (job.employer.id !== user.profile.id) {
      BaseError(TableName.ADDRESS, HttpStatus.FORBIDDEN);
    }

    await this.jobRepository.softRemove(job);

    return { job: await this.jobRepository.softRemove(job) };
  }
}
