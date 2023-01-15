import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateGroupInput, GetGroupOutput, GetGroupsOutput, UpdateGroupInput } from "apps/groups/dtos";
import { GroupService } from "apps/groups/services";
import { TableName } from "utils";

@ApiTags(TableName.GROUP)
@Controller(TableName.GROUP.toLowerCase())
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
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
    return await this.groupService.findAll(
      req.user,
      { search, type, limit }
    )
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.GROUP} not found` })
  @ApiOkResponse({ type: GetGroupOutput })
  async getById(
    @Param('id') id: string
  ): Promise<GetGroupOutput> {
    const group = await this.groupService.findOne({ id })
    return { group }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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