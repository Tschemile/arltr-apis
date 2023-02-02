import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetJobOutput, GetJobsOutput, UpdateJobDto } from 'apps/jobs/dtos';
import { TableName } from 'utils';
import { CreateJobDto } from '../../dtos/job/create-job.dto';
import { JobsService } from '../../services/job/jobs.service';


@ApiTags(TableName.JOB)
@Controller(TableName.JOB.toLowerCase())
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateJobDto,
    description: 'Successfully Created Job',
  })
  async create(@Body() createJobDto: CreateJobDto, @Request() req) {
    return await this.jobsService.create(createJobDto, req.user);
  }

  @Get()
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
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<GetJobOutput> {
    return await this.jobsService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Request() req) {
   return await this.jobsService.update(id, updateJobDto, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    return await this.jobsService.remove(id, req.user);
  }
}
