import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateReplyInput, GetRepliesOutput, GetReplyOutput, UpdateReplyInput } from "apps/forum/dtos";
import { ReplyService } from "apps/forum/services";
import { TableName } from "utils";

@ApiTags(TableName.REPLY)
@Controller(TableName.REPLY.toLowerCase())
export class ReplyController {
  constructor(
    private readonly replyService: ReplyService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @ApiCreatedResponse({ type: GetReplyOutput })
  async post(
    @Request() req,
    @Body() input: CreateReplyInput,
  ): Promise<GetReplyOutput> {
    return await this.replyService.create(req.user, input)
  }

  @Get(':blog')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'blog' })
  async getByBlog(
    @Param('blog') blog: string
  ): Promise<GetRepliesOutput> {
    return await this.replyService.findAll(blog)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.REPLY} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetReplyOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateReplyInput,
  ): Promise<GetReplyOutput> {
    return await this.replyService.update(req.user, id, input)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.REPLY} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ): Promise<GetReplyOutput> {
    return await this.replyService.remove(req.user, id)
  }
}