import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateResumeDto } from "apps/jobs/dtos/resume/create-resume.dto";
import { QueryResumeInput } from "apps/jobs/dtos/resume/query-resume.dto";
import { UpdateResumeDto } from "apps/jobs/dtos/resume/update-resume.dto";
import { Resume } from "apps/jobs/entities";
import { ProfileService } from "apps/profiles";
import { BaseService } from "base";
import { Equal, FindOptionsWhere, IsNull, Like, Not, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";

const relations = {
    candidate: true,
}

@Injectable()
export class ResumeService extends BaseService<Resume> {

    constructor(
        @InjectRepository(Resume) 
        private resumeRepository: Repository<Resume>,
        @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
    ) {
        super(resumeRepository);
    }

    async create(createRusemeDto: CreateResumeDto) {
        const profile = await this.profileService.findOne({ id: createRusemeDto.candidate});

        if(!profile) {
            return {
                status: HTTP_STATUS.Not_Found
            };
        }

        const createResume = this.resumeRepository.create({
            ...createRusemeDto,
            candidate: profile,
        });

        await this.resumeRepository.save(createResume);

        return {
            status: HTTP_STATUS.Created,
            resume: createResume, 
        }
    }

    async update (id: string, updateResumeDto: UpdateResumeDto) {
        
        const resume = await this.resumeRepository.findOne({
            where: {
                id: Equal(id),
            }
        });

        if(!resume) {
            return {
                status: HTTP_STATUS.Not_Found
            };
        }

        await this.resumeRepository.save({
            ...updateResumeDto,
            id: resume.id,
        });

        return {
            status: HTTP_STATUS.OK,
            resume: {...resume, ...updateResumeDto},
        }
    }

    async findAll(query: QueryResumeInput) {
        const {
            search = '', limit: take = 10
        } = query || {};

        const where: FindOptionsWhere<Resume> = {
            name: search ? Like(`%${search}`) : Not(IsNull()),
        }

        const result = await this.resumeRepository.findAndCount({
            relations,
            where,
            take,
        })

        const itemCount = result[1];
        return {
            resumes: result[0],
            total: itemCount,
        };
    }

    async findById(id: string) {
        const resume = await this.resumeRepository.findOne({
            where: {
                id: Equal(id),
            }
        });

        if(!resume) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        return {
            status: HTTP_STATUS.OK,
            resume,
        }
    }

    async remove(id: string) {
        const resume = await this.resumeRepository.findOne({
            relations,
            where: {
                id: Equal(id),
            }
        });

        if(!resume) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }
         await this.resumeRepository.softRemove(resume)
       return {
        status: HTTP_STATUS.OK
       }
    }
}