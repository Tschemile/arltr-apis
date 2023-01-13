import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateCommentInput, GetCommentOutput, GetCommentsOutput, UpdateCommentInput } from "apps/posts/dtos";
import { CommentService } from "apps/posts/services";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Comment'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Group not found' })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiCreatedResponse({ type: GetCommentOutput })
  async post(
    @Request() req,
    @Body() input: CreateCommentInput,
  ): Promise<GetCommentOutput> {
    const { status, comment } = await this.commentService.create(req.user, input)
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

    return { status, comment }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({ type: GetCommentsOutput })
  async get(
    @Request() req,
    @Param('id') id: string,
    @Query('limit') limit?: number
  ): Promise<GetCommentsOutput> {
    const { comments, total } = await this.commentService.findAll(id, limit)

    return {
      status: HTTP_STATUS.OK,
      comments,
      total,
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetCommentOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateCommentInput,
  ): Promise<GetCommentOutput> {
    const { status, comment } = await this.commentService.update(req.user, id, input)
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
      comment,
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
    const { status } = await this.commentService.remove(req.user, id)
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