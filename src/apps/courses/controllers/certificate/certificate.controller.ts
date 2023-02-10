import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { CreateCertificateDto } from 'apps/courses/dto/certificate/create-certificate.dto';
import {
  GetCertificateOutput,
  GetCertificatesOutput
} from 'apps/courses/dto/certificate/get-certificate.dto';
import { UpdateCertificateDto } from 'apps/courses/dto/certificate/update-certificate.dto';
import { CertificateService } from 'apps/courses/services/certificate/certificate.service';
import { ModuleName } from 'utils';


@ApiTags(ModuleName.CERTIFICATE)
@Controller(ModuleName.CERTIFICATE.toLowerCase())
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateCertificateDto,
    description: 'Successfully Created Certificate',
  })
  async create(
    @Body() createCertificateDto: CreateCertificateDto,
    @Request() req,
  ) {
    return await this.certificateService.create(createCertificateDto, req.user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'courses', required: true, type: [String] })
  @ApiOkResponse({
    type: GetCertificatesOutput,
    description: 'Get Certificates list',
  })
  async findAll(
    @Query('search') search,
    @Query('limit') limit,
    @Query('courses') courses,
  ): Promise<GetCertificatesOutput> {
    return await this.certificateService.findAll({ search, limit, courses });
  }

  @Get(':id')
  @ApiBearerAuth()
  async findById(@Param('id') id: string): Promise<GetCertificateOutput> {
    return await this.certificateService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ) {
    return this.certificateService.update(id, updateCertificateDto, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    return await this.certificateService.remove(id, req.user);
  }
}
