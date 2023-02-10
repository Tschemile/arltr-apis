import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { ROLE } from 'apps/jobs/constants';
import { CreateApplicantDto } from 'apps/jobs/dtos/applicant';
import { QueryApplicantInput } from 'apps/jobs/dtos/applicant/query-applicant.dto';
import { UpdateApplicantDto } from 'apps/jobs/dtos/applicant/update-applicant.dto';
import { Applicant } from 'apps/jobs/entities';
import { BaseError, BaseService } from 'base';
import { Any, Equal, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { ModuleName } from 'utils';
import { JobsService } from '../job';
import { ResumeService } from '../resume';

const applicantRelation = {
  resume: true,
  job: true,
};

@Injectable()
export class ApplicantService extends BaseService<Applicant> {
  constructor(
    @InjectRepository(Applicant)
    private applicantRepository: Repository<Applicant>,
    @Inject(forwardRef(() => JobsService)) private jobService: JobsService,
    @Inject(forwardRef(() => ResumeService))
    private resumeService: ResumeService,
  ) {
    super(applicantRepository, applicantRelation);
  }

  async create(createApplicantDto: CreateApplicantDto) {
    const { job: jobId, resume: resumeId } = createApplicantDto;

    const applicant = await this.findOne({
      resume: { id: resumeId },
      job: { id: jobId },
    });

    if (applicant) {
      BaseError(ModuleName.JOB, HttpStatus.NOT_FOUND);
    }

    const job = await this.jobService.findOne({ id: jobId });

    if (!job) {
      BaseError(ModuleName.JOB, HttpStatus.NOT_FOUND);
    }

    const resume = await this.resumeService.findOne({ id: resumeId });

    if (!resume) {
      BaseError(ModuleName.JOB, HttpStatus.NOT_FOUND);
    }

    const createApplicant = this.applicantRepository.create({
      ...createApplicantDto,
      resume,
      job,
      appliedAt: new Date(),
    });

    await this.applicantRepository.save(createApplicant);

    return {
      applicant: createApplicant,
    };
  }

  async findAll(user: UserToken, query: QueryApplicantInput, role: ROLE) {
    const { search = '', limit = 10 } = query || {};

    const where: FindOptionsWhere<Applicant> = {
      resume: query.resumes ? Any([query.resumes]) : Not(IsNull()),
      job: query.jobs ? Any([query.jobs]) : Not(IsNull()),
    };

    switch (role) {
      case ROLE.CANDIDATE: {
        where.resume = {
          candidate: {
            id: user.profile.id,
          },
        };
      }
      case ROLE.EMPLOYER: {
        where.job = {
          employer: {
            id: user.profile.id,
          },
        };
      }
      default: {
        where.id = Not(IsNull());
      }
    }

    const { data: applicants, total} = await this.find({
      where,
      limit,
    })

    return {
      applicants,
      total,
    }
  }

  async findById(id: string) {
    const applicant = await this.findOne({ id });

    if (!applicant) {
      BaseError(ModuleName.JOB, HttpStatus.NOT_FOUND);
    }

    return {
      applicant,
    }
  }

  async update(id: string, updateApplicantDto: UpdateApplicantDto) {
    const applicant = await this.applicantRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!applicant) {
      BaseError(ModuleName.JOB, HttpStatus.NOT_FOUND);
    }

    const job = await this.jobService.findOne({ id: updateApplicantDto.job });

    if (!job) {
      BaseError(ModuleName.JOB, HttpStatus.NOT_FOUND);
    }

    const resume = await this.resumeService.findOne({
      id: updateApplicantDto.resume,
    });

    if (!resume) {
      BaseError(ModuleName.JOB, HttpStatus.NOT_FOUND);
    }
    await this.applicantRepository.save({
      ...updateApplicantDto,
      resume,
      job,
      id: applicant.id,
    });

    return {
      applicant: { ...applicant, ...updateApplicantDto },
    };
  }

  async remove(id: string) {
    const applicant = await this.findOne({ id });

    if (!applicant) {
      BaseError(ModuleName.JOB, HttpStatus.NOT_FOUND);
    }
    return { applicant: await this.applicantRepository.softRemove(applicant) };
  }
}
