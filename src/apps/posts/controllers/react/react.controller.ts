import { Body, Controller, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { UpsertReactInput } from "apps/posts/dtos";
import { ReactService } from "apps/posts/services";
import { TableName } from "utils";

@ApiTags(TableName.REACT)
@Controller(TableName.REACT.toLowerCase())
export class ReactController {
  constructor (
    private readonly reactService: ReactService
  ) { }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.POST} not found` })
  @ApiOkResponse()
  async put(
    @Request() req,
    @Body() input: UpsertReactInput
  ) {
    return await this.reactService.upsert(req.user, input)
  }
}