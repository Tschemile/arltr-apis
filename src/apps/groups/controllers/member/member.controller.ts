import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MEMBER_STATUS, QUERY_MEMBER_TYPE } from "apps/groups/constants";
import { CreateMemberInput, GetMemberOutput, GetMembersOutput, UpdateMemberInput } from "apps/groups/dtos";
import { MemberService } from "apps/groups/services";
import { ModuleName } from "utils";

@ApiTags(ModuleName.MEMBER)
@Controller(ModuleName.MEMBER.toLowerCase())
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
  ) { }

  @Post()
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${ModuleName.GROUP} not found` })
  @ApiCreatedResponse({ type: GetMemberOutput })
  async post(
    @Request() req,
    @Body() input: CreateMemberInput,
  ): Promise<GetMemberOutput> {
    return await this.memberService.create(
      req.user,
      input,
    )
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', enum: QUERY_MEMBER_TYPE })
  @ApiQuery({ name: 'status', isArray: true, enum: MEMBER_STATUS })
  @ApiQuery({ name: 'group', required: false })
  @ApiQuery({ name: 'user', required: false })
  @ApiOkResponse({
    type: GetMembersOutput
  })
  async get(
    @Request() req,
    @Query('type') type,
    @Query('status') status,
    @Query('group') group,
    @Query('user') user,
  ): Promise<GetMembersOutput> {
    return await this.memberService.findAll(
      req.user,
      { type, status, group, user }
    )
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${ModuleName.MEMBER} not found` })
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
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${ModuleName.MEMBER} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: `Deleted successfully` })
  async delete(
    @Request() req,
    @Param('id') id: string
  ) {
    return await this.memberService.remove(req.user, id)
  }
}