import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { GetMemberOutput, GetMembersOutput, InviteMemberInput, UpdateMemberInput } from "apps/groups/dtos";
import { MemberService } from "apps/groups/services";
import { TableName } from "utils";

@ApiTags(TableName.MEMBER)
@Controller(TableName.MEMBER.toLowerCase())
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.GROUP} not found` })
  @ApiCreatedResponse({ type: GetMemberOutput })
  async post(
    @Request() req,
    @Body() input: InviteMemberInput,
  ): Promise<GetMemberOutput> {
    return await this.memberService.invite(
      req.user,
      input,
    )
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'group', required: false })
  @ApiOkResponse({
    type: GetMembersOutput
  })
  async get(
    @Request() req,
    @Query('group') group,
  ): Promise<GetMembersOutput> {
    return await this.memberService.findAll(
      req.user,
      group
    )
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.MEMBER} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetMemberOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateMemberInput,
  ) {
    return await this.memberService.update(
      req.user,
      id,
      input,
    )
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.MEMBER} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: `Deleted successfully` })
  async delete(
    @Request() req,
    @Param('id') id: string
  ) {
    return await this.memberService.remove(req.user, id)
  }
}