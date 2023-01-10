import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreatePostInput, GetPostOutput, GetPostsOutput, UpdatePostInput } from "apps/posts/dtos";
import { PostService } from "apps/posts/services";
import { HTTP_STATUS } from "utils";

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
    const { status, post } = await this.postService.create(req.user, input)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: 'Group not found'
      }
    } else if (status === HTTP_STATUS.Forbidden) {
      return {
        status,
        message: `You don't have permission to do that`
      }
    }

    return { status, post }
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
    const { posts, total } = await this.postService.findAll(
      req.user,
      { type, limit }
    )

    return {
      status: HTTP_STATUS.OK,
      posts,
      total,
    }
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
    @Param() id: string,
    @Body() input: UpdatePostInput,
  ): Promise<GetPostOutput> {
    const { status, post } = await this.postService.update(req.user, id, input)
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
      post,
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
    @Param() id: string,
  ) {
    const { status } = await this.postService.remove(req.user, id)
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