import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateResumeDto } from "apps/jobs/dtos/resume/create-resume.dto";
import { GetResumesOutput } from "apps/jobs/dtos/resume/get-resume.dto";
import { UpdateResumeDto } from "apps/jobs/dtos/resume/update-resume.dto";
import { ResumeService } from "apps/jobs/services/resume";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Resume'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class ResumeController {
    constructor( private readonly resumeService: ResumeService ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        type: CreateResumeDto,
        description: 'Successfully Created Resume'
    })
    async create (@Body() createResumeDto: CreateResumeDto) {
       return await this.resumeService.create(createResumeDto);
    }
    
    @Get()
    @UseGuards(JwtAuthGuard)
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
        const { resumes, total } = await this.resumeService.findAll({ search, limit });
        return {
            status: HTTP_STATUS.OK,
            resumes,
            total,
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findOne(@Param('id') id: string) {
      return await this.resumeService.findById(id);
    }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
    const { status, resume } = await this.resumeService.update(id, updateResumeDto);
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      };
    }
    return {    
      status,
      resume,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.resumeService.remove(id);
  }
}