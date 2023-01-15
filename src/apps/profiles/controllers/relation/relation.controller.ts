import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { FRIEND_STATUS } from "apps/profiles/constants";
import { CreateRelationInput, QUERY_RELATION_TYPE } from "apps/profiles/dtos";
import { RelationService } from "apps/profiles/services";
import { TableName } from "utils";

@ApiTags(TableName.RELATION)
@Controller(TableName.RELATION.toLowerCase())
export class RelationController {
  constructor(
    private readonly relationService: RelationService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.RELATION} not found` })
  @ApiCreatedResponse()
  async post(
    @Request() req,
    @Body() input: CreateRelationInput,
  ) {
    return await this.relationService.create(
      req.user,
      input,
    )
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', enum: QUERY_RELATION_TYPE })
  @ApiQuery({ name: 'status', enum: FRIEND_STATUS, required: false })
  async get(
    @Request() req,
    @Query('type') type: QUERY_RELATION_TYPE,
    @Query('status') status?: FRIEND_STATUS
  ) {
    return await this.relationService.findAll(
      req.user,
      type,
      status,
    )
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async count(
    @Request() req,
  ) {
    return await this.relationService.getRelations(req.user)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.RELATION} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Update successfully' })
  async patch(
    @Request() req,
    @Param('id') id: string
  ) {
    return await this.relationService.update(
      req.user,
      id,
    )
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.RELATION} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Delete successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string
  ) {
    return await this.relationService.update(
      req.user,
      id,
    )
  }
}