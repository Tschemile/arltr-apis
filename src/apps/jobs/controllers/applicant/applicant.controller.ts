import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Request} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { ROLE } from "apps/jobs/constants";
import { CreateApplicantDto } from "apps/jobs/dtos/applicant";
import { GetApplicantsOutput } from "apps/jobs/dtos/applicant/get-applicant.dto";
import { UpdateApplicantDto } from "apps/jobs/dtos/applicant/update-applicant.dto";
import { ApplicantService } from "apps/jobs/services/applicant/applicant.service";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Applicant'

@ApiTags(MODULE_NAME.toLowerCase())
@Controller(MODULE_NAME.toLowerCase())
export class ApplicantController {
    constructor( private readonly applicantService: ApplicantService ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
      type: CreateApplicantDto,
        description: 'Successfully Create applicant'
    })
    async create(@Body() createApplicantDto: CreateApplicantDto) {
        return await this.applicantService.create(createApplicantDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'jobs', required: false, type: [String] })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'resumes', required: false, type: [String] })
    @ApiQuery({ name: 'role',  enum: ROLE })
    async findAll(
        @Request() req,
        @Query('search') search,
        @Query('jobs') jobs,
        @Query('resumes') resumes,
        @Query('limit') limit,
        @Query('role') role = ROLE.CANDIDATE,

    ): Promise<GetApplicantsOutput> {
        const { applicants, total } = await this.applicantService.findAll(req.user, { search, jobs, resumes, limit }, role);
        return {
          status: HTTP_STATUS.OK,
          applicants,
          total,
        };
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findOne(@Param('id') id: string) {
        return await this.applicantService.findById(id);
      }

      @Patch(':id')
      @UseGuards(JwtAuthGuard)
      @ApiBearerAuth()
      async update(@Param('id') id: string, @Body() updateApplicantDto: UpdateApplicantDto) {
        const { status, applicant } = await this.applicantService.update(id, updateApplicantDto);
        if (status === HTTP_STATUS.Not_Found) {
          return {
            status,
            message: `${MODULE_NAME} not found`,
          };
        }
        return {
          status,
          applicant,
        };
      }

      @Delete(':id')
      @UseGuards(JwtAuthGuard)
      @ApiBearerAuth()
      async remove(@Param('id') id: string) {
        return await this.applicantService.remove(id);
      }
}