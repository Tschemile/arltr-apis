import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateLessonDto } from "apps/courses/dto/lesson/create-lesson.dto";
import { GetLessonOutput, GetLessonsOutput } from "apps/courses/dto/lesson/get-lesson.dto";
import { UpdateLessonDto } from "apps/courses/dto/lesson/update-lesson.dto";
import { LessonService } from "apps/courses/services/lesson/lesson.service";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Lesson'

@ApiTags(MODULE_NAME.toLowerCase())
@Controller(MODULE_NAME.toLowerCase())
export class LessonController {
    constructor( private readonly lessonService: LessonService ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
      type: CreateLessonDto,
      description: 'Successfully Created Lesson',
    })
    async create(@Body() createLessonDto: CreateLessonDto) {
        return await this.lessonService.create(createLessonDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
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
        const { lessons, total } = await this.lessonService.findAll({ search, limit, courses});
    return {
      status: HTTP_STATUS.OK,
      lessons,
      total,
    };
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findById(@Param('id') id: string): Promise<GetLessonOutput> {
       return await this.lessonService.findById(id);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonService.update(id, updateLessonDto);
    }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.lessonService.remove(id);
  }
}