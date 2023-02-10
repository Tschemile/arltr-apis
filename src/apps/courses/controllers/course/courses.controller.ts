import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, Request
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { UpdateCourseDto } from 'apps/courses/dto';
import {
  GetCourseOutput,
  GetCoursesOutput
} from 'apps/courses/dto/course/get-course.dto';
import { ModuleName } from 'utils';
import { CreateCourseDto } from '../../dto/course/create-course.dto';
import { CourseService } from '../../services/course/courses.service';


@ApiTags(ModuleName.COURSE)
@Controller(ModuleName.COURSE.toLowerCase())
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateCourseDto,
    description: 'Successfully Created Course',
  })
  async create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    return await this.courseService.create(createCourseDto, req.user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'authors', required: false, type: [String] })
  @ApiQuery({ name: 'categorys', required: false, type: [String] })
  @ApiOkResponse({
    type: GetCoursesOutput,
    description: 'Get Courses list',
  })
  async findAll(
    @Query('search') search,
    @Query('limit') limit,
    @Query('authors') authors,
    @Query('categorys') categorys,
  ): Promise<GetCoursesOutput> {
    return await this.courseService.findAll({
      search,
      limit,
      authors,
      categorys,
    });
  }

  @Get(':id')
  @ApiBearerAuth()
  async findById(@Param('id') id: string): Promise<GetCourseOutput> {
    return await this.courseService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(id, updateCourseDto, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    return await this.courseService.remove(id, req.user);
  }
}
