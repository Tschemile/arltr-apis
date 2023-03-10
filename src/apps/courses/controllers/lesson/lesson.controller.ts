import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { CreateLessonDto } from 'apps/courses/dto/lesson/create-lesson.dto';
import {
  GetLessonOutput,
  GetLessonsOutput
} from 'apps/courses/dto/lesson/get-lesson.dto';
import { UpdateLessonDto } from 'apps/courses/dto/lesson/update-lesson.dto';
import { LessonService } from 'apps/courses/services/lesson/lesson.service';
import { TableName } from 'utils';


@ApiTags(TableName.LESSON)
@Controller(TableName.LESSON.toLowerCase())
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateLessonDto,
    description: 'Successfully Created Lesson',
  })
  async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonService.create(createLessonDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'courses', required: true, type: [String] })
  @ApiOkResponse({
    description: 'Get Lessons list',
  })
  async findAll(
    @Query('search') search,
    @Query('limit') limit,
    @Query('courses') courses,
  ): Promise<GetLessonsOutput> {
    return await this.lessonService.findAll({ search, limit, courses });
  }

  @Get(':id')
  @ApiBearerAuth()
  async findById(@Param('id') id: string): Promise<GetLessonOutput> {
    return await this.lessonService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.lessonService.remove(id);
  }
}
