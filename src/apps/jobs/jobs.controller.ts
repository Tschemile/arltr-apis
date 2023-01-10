import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus, HttpCode, UseGuards, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'apps/auth';
import { GetJobsOutput } from './dto/get-job.dto';
import { HTTP_STATUS } from 'utils';

const MODULE_NAME = 'Jobs';

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateJobDto,
    description: 'Successfully Created Job',
  })
  async create(@Body() createJobDto: CreateJobDto, @Request() req) {
    return await this.jobsService.create(createJobDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'jobIds', required: false, type: [String] })
  @ApiQuery({ name: 'categoryIds', required: false, type: [String] })
  @ApiOkResponse({
    description: 'Get jobs list',
  })
  async findAll(
    @Query('search') search,
    @Query('type') type,
    @Query('limit') limit,
    @Query('jobIds') jobIds,
    @Query('categoryIds') categoryIds,
  ): Promise<GetJobsOutput> {
    const { jobs, total } = await this.jobsService.findAll({ search, type, limit, jobIds, categoryIds });
    return {
      status: HTTP_STATUS.OK,
      jobs,
      total,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    const job = await this.jobsService.findById(id);
    return {
      job,
      status: HTTP_STATUS.OK,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    const { status, job } = await this.jobsService.update(id, updateJobDto);
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      };
    }
    return {
      status,
      job,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.jobsService.remove(id);
  }
}
