import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'apps/auth';
import { CourseService } from '../../services/course/courses.service';
import { CreateCourseDto } from '../../dto/course/create-course.dto';
import { HTTP_STATUS } from 'utils';
import { UpdateCourseDto } from 'apps/courses/dto';
import { GetCourseOutput, GetCoursesOutput } from 'apps/courses/dto/course/get-course.dto';

const MODULE_NAME = 'Courses';

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateCourseDto,
    description: 'Successfully Created Course',
  })
  async create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    return await this.courseService.create(createCourseDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'authors', required: false, type: [String] })
  @ApiQuery({ name: 'categorys', required: false, type: [String] })
  @ApiOkResponse({
    description: 'Get Courses list',
  })
  async findAll(
    @Query('search') search,
    @Query('limit') limit,
    @Query('authors') authors,
    @Query('categorys') categorys,

  ): Promise<GetCoursesOutput> {
    const { courses, total } = await this.courseService.findAll({ search, limit, authors, categorys });
    return {
      status: HTTP_STATUS.OK,
      courses,
      total,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findById(@Param('id') id: string): Promise<GetCourseOutput> {
     return await this.courseService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Request() req, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    return await this.courseService.remove(id, req.user);
  }
}
