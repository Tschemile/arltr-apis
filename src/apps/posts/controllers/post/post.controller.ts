import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { POST_TYPE } from "apps/posts/constants";
import { CreatePostInput, GetPostOutput, GetPostsOutput, POST_QUERY_TYPE, UpdatePostInput } from "apps/posts/dtos";
import { PostService } from "apps/posts/services";
import { TableName } from "utils";

@ApiTags(TableName.POST)
@Controller(TableName.POST.toLowerCase())
export class PostController {
  constructor(
    private readonly postService: PostService
  ) { }

  @Post()
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Group not found' })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiCreatedResponse({ type: GetPostOutput })
  async post(
    @Request() req,
    @Body() input: CreatePostInput,
  ): Promise<GetPostOutput> {
    return await this.postService.create(req.user, input)
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'queryType', enum: POST_QUERY_TYPE })
  @ApiQuery({ name: 'type', required: false, enum: POST_TYPE })
  @ApiQuery({ name: 'user', required: false })
  @ApiQuery({ name: 'group', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({
    type: GetPostsOutput
  })
  async get(
    @Request() req,
    @Query('queryType') queryType,
    @Query('type') type,
    @Query('user') user,
    @Query('group') group,
    @Query('limit') limit,
    @Query('page') page,
  ): Promise<GetPostsOutput> {
    return await this.postService.findAll(
      req.user,
      { queryType, type, user, group, limit, page }
    )
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.POST} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetPostOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdatePostInput,
  ): Promise<GetPostOutput> {
    return await this.postService.update(req.user, id, input)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.POST} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ) {
    return await this.postService.remove(req.user, id)
  }
}