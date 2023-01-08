import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { GetMemberOutput, GetMembersOutput, InviteMemberInput, UpdateMemberInput } from "apps/groups/dtos";
import { MemberService } from "apps/groups/services";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Member'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiCreatedResponse({ type: GetMemberOutput })
  async post(
    @Request() req,
    @Body() input: InviteMemberInput,
  ): Promise<GetMemberOutput> {
    const { status, member } = await this.memberService.invite(
      req.user,
      input,
    )
    return {
      status,
      member,
    }
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
    const { members, total } = await this.memberService.findAll(
      req.user,
      group
    )

    return {
      status: HTTP_STATUS.OK,
      members,
      total,
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetMemberOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateMemberInput,
  ) {
    const { status, member } = await this.memberService.update(
      req.user,
      id,
      input,
    )
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    } else if (status === HTTP_STATUS.Forbidden) {
      return {
        status,
        message: `You don't have permission to do that`,
      }
    }
    return {
      status,
      member,
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: `Deleted successfully` })
  async delete(
    @Request() req,
    @Param('id') id: string
  ) {
    const { status } = await this.memberService.remove(req.user, id)

    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    } else if (status === HTTP_STATUS.Forbidden) {
      return {
        status,
        message: `You don't have permission to do that`,
      }
    }

    return {
      status,
      message: `Deleted successfully`
    }
  }
}