import { Body, Controller, Get, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateRelationInput } from "apps/profiles/dtos";
import { RelationService } from "apps/profiles/services";
import { type } from "os";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Relation'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class RelationController {
  constructor(
    private readonly relationService: RelationService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiCreatedResponse()
  async post(
    @Request() req,
    @Body() input: CreateRelationInput,
  ) {
    const { status, relation } = await this.relationService.create(
      req.user,
      input,
    )
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    }
    return {
      status,
      relation,
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', required: false })
  async get(
    @Request() req,
    @Query('type') type,
  ) {
    const { data, total } = await this.relationService.findAll(
      req.user,
      type,
    )
    return { data, total }
  }
}