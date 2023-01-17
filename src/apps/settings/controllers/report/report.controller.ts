import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, Roles } from 'apps/auth';
import { USER_ROLE } from 'apps/profiles';
import { CreateReportDto } from 'apps/settings/dtos/report/create-report.dto';
import { GetReportsOutput } from 'apps/settings/dtos/report/get-report.dto';
import { ReportService } from 'apps/settings/services/report';
import { TableName } from 'utils';

@ApiTags(TableName.REPORT)
@Controller(TableName.REPORT.toLowerCase())
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiOkResponse({
    type: CreateReportDto,
    description: 'Successfully Create Report',
  })
  async create(@Body() createReportDto: CreateReportDto, @Request() req) {
    return await this.reportService.create(createReportDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiQuery({ name: 'category', required: true, type: [String] })
  @ApiQuery({ name: 'reporter', required: true, type: [String] })
  @ApiQuery({ name: 'post', required: false, type: [String] })
  @ApiQuery({ name: 'blog', required: false, type: [String] })
  @ApiQuery({ name: 'product', required: false, type: [String] })
  @ApiQuery({ name: 'group', required: false, type: [String] })
  @ApiQuery({ name: 'job', required: false, type: [String] })
  @ApiQuery({ name: 'course', required: false, type: [String] })
  async findAll(
    @Query('category') categorys,
    @Query('reporter') reporters,
    @Query('post') posts,
    @Query('blog') blogs,
    @Query('product') products,
    @Query('group') groups,
    @Query('job') jobs,
    @Query('course') courses,
  ): Promise<GetReportsOutput> {
    return await this.reportService.findAll({
      categorys,
      reporters,
      posts,
      blogs,
      products,
      groups,
      jobs,
      courses,
    });
  }
}
