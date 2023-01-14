import { forwardRef, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { CreateCertificateDto } from "apps/courses/dto/certificate/create-certificate.dto";
import { QueryCertificateInput } from "apps/courses/dto/certificate/query-certificate.dto";
import { UpdateCertificateDto } from "apps/courses/dto/certificate/update-certificate.dto";
import { Certificate } from "apps/courses/entities/certificate.entity";
import { ProfileService } from "apps/profiles";
import { BaseService } from "base";
import { Any, FindOptionsWhere, IsNull, Not, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { CourseService } from "../course";

const relations = {
    course: true,
    user: true,
}

export class CertificateService extends BaseService<Certificate> {
    constructor(
        @InjectRepository(Certificate)
        private certificateRepository: Repository<Certificate>,
        @Inject(forwardRef(()=> CourseService)) private courseService: CourseService,
    ) {
        super(certificateRepository)
    }

    async create(createCertificateDto: CreateCertificateDto, user: UserToken) {
        const { course: courseId } = createCertificateDto;
        const course = await this.courseService.findOne({ id: courseId });

        if(!course) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        const certificate = await this.findOne({course: { id: courseId}, user: { id: user.profile.id }});

        if(certificate) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }
        
        const createCertificate = this.certificateRepository.create({
            ...createCertificateDto,
            course,
            user: user.profile,
        });

        await this.certificateRepository.save(createCertificate);

        return {
            status: HTTP_STATUS.OK,
            certificate: createCertificate,
        }
    }

    async findAll(query: QueryCertificateInput) {
        const {
            search = '', limit: take = 10,
        } = query || {}

        const where: FindOptionsWhere<Certificate> = {
            course: query.courses ? Any([query.courses]) : Not(IsNull()),
        }

        const result = await this.certificateRepository.findAndCount({
            relations,
            where,
            take,
        });

        const itemCount = result[1];
        return {
        certificates: result[0],
        total: itemCount,
        };
    }

    async findById(id: string) {
        const certificate = await this.findOne({ id });

        if(!certificate) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        return {
            status: HTTP_STATUS.OK,
            certificate,
        }
    }

    async update(id: string, updateCertificateDto: UpdateCertificateDto, user: UserToken) {
        const certificate = await this.findOne({ id });

        if(!certificate) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }
        
        const course = await this.courseService.findOne({ id: updateCertificateDto.course });

        if(!course) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        if(user.profile.id !== certificate.user.id) {
            return {
                status: HTTP_STATUS.Forbidden,
            }
        }

        await this.certificateRepository.save({
            ...updateCertificateDto,
            id: certificate.id,
            course,
            user: user.profile,
        });

        return {
            status: HTTP_STATUS.OK,
            certificate: {...certificate, ...updateCertificateDto}
        }

    }

    async remove(id: string, user: UserToken) {
        const certificate = await this.findOne({ id }, relations);

        if(!certificate) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        if(user.profile.id !== certificate.user.id) {
            return {
                status: HTTP_STATUS.Forbidden,
            }
        }

        await this.certificateRepository.softRemove(certificate);

        return {
            status: HTTP_STATUS.OK,
        }
    }
}