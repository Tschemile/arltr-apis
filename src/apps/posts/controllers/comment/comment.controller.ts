import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateCommentInput, GetCommentOutput, GetCommentsOutput, UpdateCommentInput } from "apps/posts/dtos";
import { CommentService } from "apps/posts/services";
import { TableName } from "utils";

@ApiTags(TableName.COMMENT)
@Controller(TableName.COMMENT.toLowerCase())
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.GROUP} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiCreatedResponse({ type: GetCommentOutput })
  async post(
    @Request() req,
    @Body() input: CreateCommentInput,
  ): Promise<GetCommentOutput> {
    return await this.commentService.create(req.user, input)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'post' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({ type: GetCommentsOutput })
  async get(
    @Request() req,
    @Query('post') post: string,
    @Query('limit') limit?: number
  ): Promise<GetCommentsOutput> {
    return await this.commentService.findAll(post, limit)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.COMMENT} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetCommentOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateCommentInput,
  ): Promise<GetCommentOutput> {
    return await this.commentService.update(req.user, id, input)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.COMMENT} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ) {
    return await this.commentService.remove(req.user, id)
  }
}