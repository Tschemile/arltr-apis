import { Body, Controller, Delete, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateReplyInput, GetReplyOutput, UpdateReplyInput } from "apps/forum/dtos";
import { ReplyService } from "apps/forum/services";
import { HTTP_STATUS } from "utils";

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
    const { status, reply } = await this.replyService.create(req.user, input)
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: 'Category not found'
      }
    }

    return { status, reply }
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
    const { status, reply } = await this.replyService.update(req.user, id, input)
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
      reply,
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
    const { status } = await this.replyService.remove(req.user, id)
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