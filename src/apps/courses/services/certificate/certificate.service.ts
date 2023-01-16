import { forwardRef, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { CreateCertificateDto } from 'apps/courses/dto/certificate/create-certificate.dto';
import { QueryCertificateInput } from 'apps/courses/dto/certificate/query-certificate.dto';
import { UpdateCertificateDto } from 'apps/courses/dto/certificate/update-certificate.dto';
import { Certificate } from 'apps/courses/entities/certificate.entity';
import { BaseError, BaseService } from 'base';
import { Any, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { TableName } from 'utils';
import { CourseService } from '../course';

const certificateRelation = {
  course: true,
  user: true,
};

export class CertificateService extends BaseService<Certificate> {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    @Inject(forwardRef(() => CourseService))
    private courseService: CourseService,
  ) {
    super(certificateRepository, certificateRelation);
  }

  async create(createCertificateDto: CreateCertificateDto, user: UserToken) {
    const { course: courseId } = createCertificateDto;
    const course = await this.courseService.findOne({ id: courseId });

    if (!course) {
      BaseError(TableName.COURSE, HttpStatus.NOT_FOUND);
    }

    const certificate = await this.findOne({
      course: { id: courseId },
      user: { id: user.profile.id },
    });

    if (certificate) {
      BaseError(TableName.COURSE, HttpStatus.NOT_FOUND);
    }

    const createCertificate = this.certificateRepository.create({
      ...createCertificateDto,
      course,
      user: user.profile,
    });

    await this.certificateRepository.save(createCertificate);

    return {
      certificate: createCertificate,
    };
  }

  async findAll(query: QueryCertificateInput) {
    const { search = '', limit = 10 } = query || {};

    const where: FindOptionsWhere<Certificate> = {
      course: query.courses ? Any([query.courses]) : Not(IsNull()),
    };

    const { data: certificates, total} = await this.find({
      where,
      limit,
    });

    return {
      certificates,
      total,
    };
  }

  async findById(id: string) {
    const certificate = await this.findOne({ id });

    if (!certificate) {
      BaseError(TableName.COURSE, HttpStatus.NOT_FOUND);
    }

    return {
      certificate,
    };
  }

  async update(
    id: string,
    updateCertificateDto: UpdateCertificateDto,
    user: UserToken,
  ) {
    const certificate = await this.findOne({ id });

    if (!certificate) {
      BaseError(TableName.COURSE, HttpStatus.NOT_FOUND);
    }

    const course = await this.courseService.findOne({
      id: updateCertificateDto.course,
    });

    if (!course) {
      BaseError(TableName.COURSE, HttpStatus.NOT_FOUND);
    }

    if (user.profile.id !== certificate.user.id) {
      BaseError(TableName.COURSE, HttpStatus.FORBIDDEN);
    }

    await this.certificateRepository.save({
      ...updateCertificateDto,
      id: certificate.id,
      course,
      user: user.profile,
    });

    return {
      certificate: { ...certificate, ...updateCertificateDto },
    };
  }

  async remove(id: string, user: UserToken) {
    const certificate = await this.findOne({ id });

    if (!certificate) {
      BaseError(TableName.COURSE, HttpStatus.NOT_FOUND);
    }

    if (user.profile.id !== certificate.user.id) {
      BaseError(TableName.COURSE, HttpStatus.FORBIDDEN);
    }

    return {
      certificate: await this.certificateRepository.softRemove(certificate),
    };
  }
}
