import { Body, Controller, Get, Put, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { REACT_TYPE } from "apps/posts/constants";
import { GetReactOutput, GetReactsOutput, UpsertReactInput } from "apps/posts/dtos";
import { ReactService } from "apps/posts/services";
import { TableName } from "utils";

@ApiTags(TableName.REACT)
@Controller(TableName.REACT.toLowerCase())
export class ReactController {
  constructor (
    private readonly reactService: ReactService
  ) { }

  @Put()
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.POST} not found` })
  @ApiOkResponse()
  async put(
    @Request() req,
    @Body() input: UpsertReactInput
  ): Promise<GetReactOutput> {
    return await this.reactService.upsert(req.user, input)
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', enum: REACT_TYPE, required: false })
  @ApiQuery({ name: 'post', required: false })
  @ApiQuery({ name: 'comment', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({
    type: GetReactsOutput
  })
  async gets(
    @Query('type') type?: string,
    @Query('post') post?: string,
    @Query('comment') comment?: string,
    @Query('limit') limit?: number,
  ) {
    return await this.reactService.findAll({
      type,
      post,
      comment,
      limit,
    })
  }
}