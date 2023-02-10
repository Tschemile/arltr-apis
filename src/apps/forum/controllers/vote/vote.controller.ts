import { Body, Controller, Put, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UpsertVoteInput } from "apps/forum/dtos";
import { VoteService } from "apps/forum/services";
import { ModuleName } from "utils";

@ApiTags(ModuleName.VOTE)
@Controller(ModuleName.VOTE.toLowerCase())
export class VoteController {
  constructor(
    private readonly voteService: VoteService
  ) { }

  @Put()
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