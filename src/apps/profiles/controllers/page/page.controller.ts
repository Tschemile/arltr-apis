import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreatePageInput, GetPageOutput, GetPagesOutput, UpdatePageInput } from "apps/profiles/dtos";
import { PageService } from "apps/profiles/services";
import { TableName } from "utils";

@ApiTags(TableName.PAGE)
@Controller(TableName.PAGE.toLowerCase())
export class PageController {
  constructor(
    private readonly pageService: PageService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.PAGE} not found` })
  @ApiCreatedResponse({ type: GetPageOutput })
  async post(
    @Request() req,
    @Body() input: CreatePageInput,
  ): Promise<GetPageOutput> {
    return await this.pageService.create(
      req.user,
      input,
    )
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({
    type: GetPagesOutput
  })
  async get(
    @Query('search') search,
    @Query('category') category,
    @Query('limit') limit,
  ): Promise<GetPagesOutput> {
    return await this.pageService.findAll(
      { search, category, limit }
    )
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.PAGE} not found` })
  @ApiOkResponse({ type: GetPageOutput })
  async getById(
    @Param('id') id: string
  ): Promise<GetPageOutput> {
    return await this.pageService.findById(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.PAGE} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetPageOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdatePageInput,
  ) {
    return await this.pageService.update(
      req.user,
      id,
      input,
    )
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.PAGE} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ description: `Deleted successfully` })
  async delete(
    @Request() req,
    @Param('id') id: string
  ) {
    return await this.pageService.remove(req.user, id)
  }
}