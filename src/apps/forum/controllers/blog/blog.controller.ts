import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateBlogInput, GetBlogOutput, GetBlogsOutput, QUERY_TYPE, UpdateBlogInput } from "apps/forum/dtos";
import { BlogService } from "apps/forum/services";
import { ModuleName } from "utils";

@ApiTags(ModuleName.BLOG)
@Controller(ModuleName.BLOG.toLowerCase())
export class BlogController {
  constructor(
    private readonly blogService: BlogService
  ) { }

  @Post()
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${ModuleName.CATEGORY} not found` })
  @ApiCreatedResponse({ type: GetBlogOutput })
  async post(
    @Request() req,
    @Body() input: CreateBlogInput,
  ): Promise<GetBlogOutput> {
    return await this.blogService.create(req.user, input)
  }

  @Get()
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
  ): Promise<GetBlogsOutput>  {
    return await this.blogService.findAll(req.user, {
      type,
      search,
      categories,
      tags,
      author,
      status,
    })
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${ModuleName.BLOG} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetBlogOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateBlogInput,
  ): Promise<GetBlogOutput> {
    return await this.blogService.update(req.user, id, input)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${ModuleName.BLOG} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ): Promise<GetBlogOutput>  {
    return await this.blogService.remove(req.user, id)
  }
}