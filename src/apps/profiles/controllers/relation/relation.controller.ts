import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FRIEND_STATUS } from 'apps/profiles/constants';
import { QUERY_RELATION_TYPE, UpsertRelationInput } from 'apps/profiles/dtos';
import { FriendRelationInput } from 'apps/profiles/dtos/relation/friend-relation.input';
import { RelationService } from 'apps/profiles/services';
import { TableName } from 'utils';
 
@ApiTags(TableName.RELATION)
@Controller(TableName.RELATION.toLowerCase())
export class RelationController {
  constructor(private readonly relationService: RelationService) {}

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', enum: QUERY_RELATION_TYPE })
  @ApiQuery({
    name: 'status',
    enum: FRIEND_STATUS,
    required: false,
    isArray: true,
  })
  async get(
    @Request() req,
    @Query('type') type: QUERY_RELATION_TYPE,
    @Query('status') status?: FRIEND_STATUS,
  ) {
    return await this.relationService.findAll(req.user, type, status);
  }

  @Get('count')
  @ApiBearerAuth()
  async count(@Request() req) {
    return await this.relationService.getRelations(req.user);
  }

  @Post('friend')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.RELATION} not found` })
  async post(@Request() req, @Body() input: FriendRelationInput) {
    return await this.relationService.addFriend(req.user, input);
  }

  @Put()
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.RELATION} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  async patch(@Request() req, @Body() input: UpsertRelationInput) {
    return await this.relationService.upsert(req.user, input);
  }
}
