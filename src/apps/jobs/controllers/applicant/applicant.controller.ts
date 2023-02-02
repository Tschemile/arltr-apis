import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query, Request
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { ROLE } from 'apps/jobs/constants';
import { CreateApplicantDto } from 'apps/jobs/dtos/applicant';
import {
  GetApplicantOutput,
  GetApplicantsOutput
} from 'apps/jobs/dtos/applicant/get-applicant.dto';
import { UpdateApplicantDto } from 'apps/jobs/dtos/applicant/update-applicant.dto';
import { ApplicantService } from 'apps/jobs/services/applicant/applicant.service';
import { TableName } from 'utils';


@ApiTags(TableName.APPLICANT)
@Controller(TableName.APPLICANT.toLowerCase())
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateApplicantDto,
    description: 'Successfully Create applicant',
  })
  async create(@Body() createApplicantDto: CreateApplicantDto) {
    return await this.applicantService.create(createApplicantDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'jobs', required: false, type: [String] })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'resumes', required: false, type: [String] })
  @ApiQuery({ name: 'role', enum: ROLE })
  async findAll(
    @Request() req,
    @Query('search') search,
    @Query('jobs') jobs,
    @Query('resumes') resumes,
    @Query('limit') limit,
    @Query('role') role = ROLE.CANDIDATE,
  ): Promise<GetApplicantsOutput> {
    return await this.applicantService.findAll(
      req.user,
      { search, jobs, resumes, limit },
      role,
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<GetApplicantOutput> {
    return await this.applicantService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateApplicantDto: UpdateApplicantDto,
  ) {
    return  await this.applicantService.update(
      id,
      updateApplicantDto,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.applicantService.remove(id);
  }
}
