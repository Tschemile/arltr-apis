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
import { CreateResumeDto } from 'apps/jobs/dtos/resume/create-resume.dto';
import {
  GetResumeOutput,
  GetResumesOutput
} from 'apps/jobs/dtos/resume/get-resume.dto';
import { UpdateResumeDto } from 'apps/jobs/dtos/resume/update-resume.dto';
import { ResumeService } from 'apps/jobs/services/resume';
import { TableName } from 'utils';


@ApiTags(TableName.RESUME)
@Controller(TableName.RESUME.toLowerCase())
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateResumeDto,
    description: 'Successfully Created Resume',
  })
  async create(@Body() createResumeDto: CreateResumeDto) {
    return await this.resumeService.create(createResumeDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({
    description: 'Get resume list',
  })
  async findAll(
    @Query('search') search,
    @Query('limit') limit,
  ): Promise<GetResumesOutput> {
    return await this.resumeService.findAll({ search, limit });
  }

  @Get(':id')
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<GetResumeOutput> {
    return await this.resumeService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @Request() req,
  ) {
    return await this.resumeService.update(id, updateResumeDto, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    return await this.resumeService.remove(id, req.user);
  }
}
