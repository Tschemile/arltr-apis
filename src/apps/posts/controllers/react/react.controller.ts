import { Body, Controller, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { UpsertReactInput } from "apps/posts/dtos";
import { ReactService } from "apps/posts/services";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'React'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class ReactController {
  constructor (
    private readonly reactService: ReactService
  ) { }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiOkResponse()
  async put(
    @Request() req,
    @Body() input: UpsertReactInput
  ) {
    const { status } = await this.reactService.upsert(req.user, input)

    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: 'Post not found'
      }
    }

    return {
      status
    }
  }
}