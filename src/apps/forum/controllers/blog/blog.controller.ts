import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateBlogInput, GetBlogOutput, GetBlogsOutput, QUERY_TYPE, UpdateBlogInput } from "apps/forum/dtos";
import { BlogService } from "apps/forum/services";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Blog'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class BlogController {
  constructor(
    private readonly blogService: BlogService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiCreatedResponse({ type: GetBlogOutput })
  async post(
    @Request() req,
    @Body() input: CreateBlogInput,
  ): Promise<GetBlogOutput> {
    const { status, blog } = await this.blogService.create(req.user, input)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: 'Category not found'
      }
    }

    return { status, blog }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'type' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categories', type: [String], required: false })
  @ApiQuery({ name: 'tags', type: [String], required: false })
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiOkResponse({ type: GetBlogsOutput })
  async gets(
    @Request() req,
    @Query('type') type: QUERY_TYPE,
    @Query('search') search?: string,
    @Query('categories') categories?: string[],
    @Query('tags') tags?: string[],
    @Query('author') author?: string,
    @Query('status') status?: string,
  ) {
    const { blogs, total } = await this.blogService.findAll(req.user, {
      type,
      search,
      categories,
      tags,
      author,
      status,
    })

    return {
      status: HTTP_STATUS.OK,
      blogs,
      total,
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetBlogOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateBlogInput,
  ): Promise<GetBlogOutput> {
    const { status, blog } = await this.blogService.update(req.user, id, input)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    } else if (status === HTTP_STATUS.Forbidden) {
      return {
        status,
        message: `You don't have permission to do that`
      }
    }

    return {
      status,
      blog,
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ) {
    const { status } = await this.blogService.remove(req.user, id)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    } else if (status === HTTP_STATUS.Forbidden) {
      return {
        status,
        message: `You don't have permission to do that`
      }
    }

    return {
      status,
      message: 'Deleted successfully',
    }
  }
}