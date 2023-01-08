import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreatePageInput, GetPageOutput, GetPagesOutput, UpdatePageInput } from "apps/profiles/dtos";
import { PageService } from "apps/profiles/services";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Page'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class PageController {
  constructor(
    private readonly pageService: PageService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiCreatedResponse({ type: GetPageOutput })
  async post(
    @Request() req,
    @Body() input: CreatePageInput,
  ): Promise<GetPageOutput> {
    const { status, page } = await this.pageService.create(
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
      page,
    }
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
    const { status, pages, total } = await this.pageService.findAll(
      { search, category, limit }
    )

    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        pages: [],
        message: `${MODULE_NAME} not found`,
      }
    }
    return {
      status: HTTP_STATUS.OK,
      pages,
      total,
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ type: GetPageOutput })
  async getById(
    @Param('id') id: string
  ): Promise<GetPageOutput> {
    const page = await this.pageService.findOne({id})
    if (!page) {
      return {
        status: HTTP_STATUS.Not_Found,
        message: `${MODULE_NAME} not found`,
      }
    }
    return {
      status: HTTP_STATUS.OK,
      page,
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that` })
  @ApiOkResponse({ type: GetPageOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdatePageInput,
  ) {
    const { status, page } = await this.pageService.update(
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
      page,
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
    const { status } = await this.pageService.remove(req.user, id)

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