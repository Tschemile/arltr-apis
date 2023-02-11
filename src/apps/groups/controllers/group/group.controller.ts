import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { GROUP_MODE, QUERY_GROUP_TYPE } from "apps/groups/constants";
import { CreateGroupInput, GetGroupFullOutput, GetGroupOutput, GetGroupsOutput, UpdateGroupInput } from "apps/groups/dtos";
import { GroupService } from "apps/groups/services";
import { TableName } from "utils";

@ApiTags(TableName.GROUP)
@Controller(TableName.GROUP.toLowerCase())
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
  ) { }

  @Post()
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.GROUP} not found` })
  @ApiCreatedResponse({ type: GetGroupOutput })
  async post(
    @Request() req,
    @Body() input: CreateGroupInput,
  ): Promise<GetGroupOutput> {
    return await this.groupService.create(
      req.user,
      input,
    )
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'mode', enum: GROUP_MODE })
  @ApiQuery({ name: 'type', enum: QUERY_GROUP_TYPE })
  @ApiQuery({ name: 'user', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({
    type: GetGroupsOutput
  })
  async get(
    @Request() req,
    @Query('search') search,
    @Query('type') type,
    @Query('mode') mode,
    @Query('user') user,
    @Query('limit') limit,
  ): Promise<GetGroupsOutput> {
    return await this.groupService.findAll(
      req.user,
      { search, type, mode, user, limit }
    )
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.GROUP} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetGroupFullOutput })
  async getById(
    @Request() req,
    @Param('id') id: string
  ): Promise<GetGroupOutput> {
    return await this.groupService.findById(req.user, id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.GROUP} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetGroupOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateGroupInput,
  ) {
    return await this.groupService.update(
      req.user,
      id,
      input,
    )
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.GROUP} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: `Deleted successfully` })
  async delete(
    @Request() req,
    @Param('id') id: string
  ) {
    return await this.groupService.remove(req.user, id)
  }
}