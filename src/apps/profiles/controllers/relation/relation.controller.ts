import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { FRIEND_STATUS, RELATION_ACTION } from "apps/profiles/constants";
import { QUERY_RELATION_TYPE, UpsertRelationInput } from "apps/profiles/dtos";
import { RelationService } from "apps/profiles/services";
import { TableName } from "utils";

@ApiTags(TableName.RELATION)
@Controller(TableName.RELATION.toLowerCase())
export class RelationController {
  constructor(
    private readonly relationService: RelationService,
  ) { }


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

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.RELATION} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  async patch(
    @Request() req,
    @Body() input: UpsertRelationInput,
  ) {
    return await this.relationService.upsert(
      req.user,
      input,
    )
  }

}