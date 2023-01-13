import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { ROLE } from "apps/jobs/constants";
import { CreateApplicantDto } from "apps/jobs/dtos/applicant";
import { QueryApplicantInput } from "apps/jobs/dtos/applicant/query-applicant.dto";
import { UpdateApplicantDto } from "apps/jobs/dtos/applicant/update-applicant.dto";
import { Applicant } from "apps/jobs/entities";
import { BaseService } from "base";
import { Any, Equal, FindOptionsWhere, IsNull, Not, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { JobsService } from "../job";
import { ResumeService } from "../resume";

const relations = {
    resume: true,
    job: true,
}

@Injectable()
export class ApplicantService extends BaseService<Applicant> {
    constructor(
        @InjectRepository(Applicant)
        private applicantRepository: Repository<Applicant>,
        @Inject(forwardRef(() => JobsService)) private jobService: JobsService,
        @Inject(forwardRef(() => ResumeService)) private resumeService: ResumeService,
    ) {
        super(applicantRepository);
    }

    async create(createApplicantDto: CreateApplicantDto) {
        const { job: jobId, resume: resumeId } = createApplicantDto;

        const applicant = await this.findOne({ resume: { id: resumeId }, job: { id: jobId } });

        if(applicant) {
            return {
                status: HTTP_STATUS.Not_Found
            }
        }
        

        const job = await this.jobService.findOne({ id: jobId });

        if(!job) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        const resume = await this.resumeService.findOne({ id: resumeId });

        if(!resume) {
            return {
                status: HTTP_STATUS.Not_Found,            }
        }

        const createApplicant = this.applicantRepository.create({
            ...createApplicantDto,
            resume,
            job,
            appliedAt: new Date(),
        });

        await this.applicantRepository.save(createApplicant);

        return {
            status: HTTP_STATUS.OK,
            applicant: createApplicant,
        }
    }

    async findAll(user: UserToken, query: QueryApplicantInput, role: ROLE) {
        const {
            search = '', limit: take = 10
        } = query || {};
 
        const where: FindOptionsWhere<Applicant> = {
            resume: query.resumes ? Any([query.resumes]) : Not(IsNull()),
            job: query.jobs ? Any([query.jobs]) : Not(IsNull()),
        }

        switch (role) {
            case ROLE.CANDIDATE: {
                where.resume = {
                    candidate: {
                        id: user.profile.id
                    }
                }
            }
            case ROLE.EMPLOYER: {
                where.job = {
                    employer: {
                        id: user.profile.id
                    }
                }
            }
            default: {
                where.id = Not(IsNull())
            }
        }

        const result = await this.applicantRepository.findAndCount({
            relations,
            where,
            take,
        });

        const itemCount = result[1];
        return {
          applicants: result[0],
          total: itemCount,
        };
    }

    async findById(id: string) {
        const applicant = await this.findOne({ id });

        if(!applicant) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        return {
            status: HTTP_STATUS.OK,
            applicant,
        }
    }

    async update(id: string, updateApplicantDto: UpdateApplicantDto) {
        const applicant = await this.applicantRepository.findOne({
            where: {
                id: Equal(id),
            }
        });

        if(!applicant) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        const job = await this.jobService.findOne({ id: updateApplicantDto.job });

        if(!job) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        const resume = await this.resumeService.findOne({ id: updateApplicantDto.resume });

        if(!resume) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }
        await this.applicantRepository.save({
            ...updateApplicantDto,
            resume,
            job,
            id: applicant.id,
        });

        return {
            status: HTTP_STATUS.OK,
            applicant: { ...applicant, ...updateApplicantDto },
          };
    }

    async remove(id: string) {
        const applicant = await this.findOne({ id });

        if(!applicant) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }
    
        await this.applicantRepository.save({
            id: applicant.id,
            isDeleted: true,
            deletedAt: new Date(),
        });
        return { status: HTTP_STATUS.OK }
    }
}