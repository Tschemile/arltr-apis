import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, Roles, RolesGuard } from "apps/auth";
import { USER_ROLE } from "apps/profiles";
import { CreateCategoryInput, UpdateCategoryInput } from "apps/settings/dtos";
import { Category } from "apps/settings/entities";
import { CategoryService } from "apps/settings/services";

const MODULE_NAME = 'Category'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) { }

  @Post()
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: `You don't have permission to do it` })
  @ApiOkResponse({ type: Category })
  async post(
    @Body() input: CreateCategoryInput,
  ) {
    const category = await this.categoryService.create(input)
    return {
      category,
    }
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  async gets(
    @Query('search') search: string,
  ) {
    return await this.categoryService.findAll(search)
  }

  @Patch(':id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: `You don't have permission to do it` })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ type: Category })
  async update(
    @Param('id') id: string,
    @Body() input: UpdateCategoryInput
  ) {
    return await this.categoryService.update(
      id,
      input,
    )
  }

  @Delete(':id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: `You don't have permission to do it` })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Param('id') id: string
  ) {
    return await this.categoryService.remove(id)
  }
}