import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreatePostInput, GetPostOutput, GetPostsOutput, UpdatePostInput } from "apps/posts/dtos";
import { PostService } from "apps/posts/services";

const MODULE_NAME = 'Post'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class PostController {
  constructor(
    private readonly postService: PostService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({
    type: GetPostsOutput
  })
  async get(
    @Request() req,
    @Query('type') type,
    @Query('limit') limit,
  ): Promise<GetPostsOutput> {
    return await this.postService.findAll(
      req.user,
      { type, limit }
    )
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
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
    return await this.postService.remove(req.user, id)
  }
}