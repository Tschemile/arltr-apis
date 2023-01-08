import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateGroupInput, GetGroupOutput, GetGroupsOutput, UpdateGroupInput } from "apps/groups/dtos";
import { GroupService } from "apps/groups/services";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Group'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiCreatedResponse({ type: GetGroupOutput })
  async post(
    @Request() req,
    @Body() input: CreateGroupInput,
  ): Promise<GetGroupOutput> {
    const { status, group } = await this.groupService.create(
      req.user,
      input,
    )
    return {
      status,
      group,
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({
    type: GetGroupsOutput
  })
  async get(
    @Request() req,
    @Query('search') search,
    @Query('type') type,
    @Query('limit') limit,
  ): Promise<GetGroupsOutput> {
    const { groups, total } = await this.groupService.findAll(
      req.user,
      { search, type, limit }
    )

    return {
      status: HTTP_STATUS.OK,
      groups,
      total,
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ type: GetGroupOutput })
  async getById(
    @Param('id') id: string
  ): Promise<GetGroupOutput> {
    const group = await this.groupService.findOne({ id })
    if (!group) {
      return {
        status: HTTP_STATUS.Not_Found,
        message: `${MODULE_NAME} not found`,
      }
    }
    return {
      status: HTTP_STATUS.OK,
      group,
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetGroupOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateGroupInput,
  ) {
    const { status, group } = await this.groupService.update(
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
      group,
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
    const { status } = await this.groupService.remove(req.user, id)

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