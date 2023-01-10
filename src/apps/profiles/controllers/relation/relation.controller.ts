import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { FRIEND_STATUS } from "apps/profiles/constants";
import { CreateRelationInput, QUERY_RELATION_TYPE } from "apps/profiles/dtos";
import { RelationService } from "apps/profiles/services";
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
  @ApiQuery({ name: 'type', enum: QUERY_RELATION_TYPE })
  @ApiQuery({ name: 'status', enum: FRIEND_STATUS, required: false })
  async get(
    @Request() req,
    @Query('type') type: QUERY_RELATION_TYPE,
    @Query('status') status?: FRIEND_STATUS
  ) {
    const { data, total } = await this.relationService.findAll(
      req.user,
      type,
      status,
    )
    return { data, total }
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async count(
    @Request() req,
  ) {
    const data = await this.relationService.getRelations(req.user)
    return data
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Update successfully' })
  async patch(
    @Request() req,
    @Param('id') id: string
  ) {
    const { status } = await this.relationService.update(
      req.user,
      id,
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
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: 'Delete successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string
  ) {
    const { status } = await this.relationService.update(
      req.user,
      id,
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
    }
  }
}