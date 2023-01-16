import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { CreateResumeDto } from 'apps/jobs/dtos/resume/create-resume.dto';
import { QueryResumeInput } from 'apps/jobs/dtos/resume/query-resume.dto';
import { UpdateResumeDto } from 'apps/jobs/dtos/resume/update-resume.dto';
import { Resume } from 'apps/jobs/entities';
import { ProfileService } from 'apps/profiles';
import { BaseError, BaseService } from 'base';
import {
  FindOptionsWhere,
  IsNull,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { TableName } from 'utils';

const relations = {
  candidate: true,
};

@Injectable()
export class ResumeService extends BaseService<Resume> {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
  ) {
    super(resumeRepository);
  }

  async create(createRusemeDto: CreateResumeDto) {
    const profile = await this.profileService.findOne({
      id: createRusemeDto.candidate,
    });

    if (!profile) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }

    const createResume = this.resumeRepository.create({
      ...createRusemeDto,
      candidate: profile,
    });

    await this.resumeRepository.save(createResume);

    return {
      resume: createResume,
    };
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: UserToken) {
    const resume = await this.findOne({ id });

    if (!resume) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }

    if (user.profile.id !== resume.candidate.id) {
      BaseError(TableName.ADDRESS, HttpStatus.FORBIDDEN);
    }

    await this.resumeRepository.save({
      ...updateResumeDto,
      id: resume.id,
    });

    return {
      resume: { ...resume, ...updateResumeDto },
    };
  }

  async findAll(query: QueryResumeInput) {
    const { search = '', limit: take = 10 } = query || {};

    const where: FindOptionsWhere<Resume> = {
      name: search ? Like(`%${search}`) : Not(IsNull()),
    };

    const result = await this.resumeRepository.findAndCount({
      relations,
      where,
      take,
    });

    const itemCount = result[1];
    return {
      resumes: result[0],
      total: itemCount,
    };
  }

  async findById(id: string) {
    const resume = await this.findOne({ id });

    if (!resume) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }
    return {
      resume,
    };
  }

  async remove(id: string, user: UserToken) {
    const resume = await this.findOne({ id }, relations);

    if (!resume) {
      BaseError(TableName.JOB, HttpStatus.NOT_FOUND);
    }

    if (user.profile.id !== resume.candidate.id) {
      BaseError(TableName.ADDRESS, HttpStatus.FORBIDDEN);
    }

    return {
      resume: await this.resumeRepository.softRemove(resume),
    };
  }
}
