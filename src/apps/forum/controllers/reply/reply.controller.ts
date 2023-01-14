import { Body, Controller, Delete, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateReplyInput, GetReplyOutput, UpdateReplyInput } from "apps/forum/dtos";
import { ReplyService } from "apps/forum/services";

const MODULE_NAME = 'Reply'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
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
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ) {
    return await this.replyService.remove(req.user, id)
  }
}