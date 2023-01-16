import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus, HttpCode, UseGuards, Query } from '@nestjs/common';
import { JobsService } from '../../services/job/jobs.service';
import { CreateJobDto } from '../../dtos/job/create-job.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'apps/auth';
import { GetJobOutput, GetJobsOutput, UpdateJobDto } from 'apps/jobs/dtos';
import { TableName } from 'utils';


@ApiTags(TableName.JOB)
@Controller(TableName.JOB.toLowerCase())
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
    return await this.jobsService.findAll({ search, type, limit, jobIds, categoryIds });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<GetJobOutput> {
    return await this.jobsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Request() req) {
   return await this.jobsService.update(id, updateJobDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    return await this.jobsService.remove(id, req.user);
  }
}
