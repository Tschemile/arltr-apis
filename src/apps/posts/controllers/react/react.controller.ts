import { Body, Controller, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { UpsertReactInput } from "apps/posts/dtos";
import { ReactService } from "apps/posts/services";

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
    return await this.reactService.upsert(req.user, input)
  }
}