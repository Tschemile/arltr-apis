import { Body, Controller, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { UpsertVoteInput } from "apps/forum/dtos";
import { VoteService } from "apps/forum/services";

const MODULE_NAME = 'Vote'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class VoteController {
  constructor(
    private readonly voteService: VoteService
  ) { }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @ApiOkResponse()
  async put(
    @Request() req,
    @Body() input: UpsertVoteInput
  ) {
    return await this.voteService.upsert(req.user, input)
  }
}