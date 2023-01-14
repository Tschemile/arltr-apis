import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateProductInput, GetProductOutput, UpdateProductInput } from "apps/shop/dtos";
import { ProductService } from "apps/shop/services";

const MODULE_NAME = 'Product'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetProductOutput })
  async post(
    @Request() req,
    @Body() input: CreateProductInput
  ): Promise<GetProductOutput> {
    return await this.productService.create(req.user, input)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetProductOutput })
  async getById(
    @Param('id') id: string,
  ): Promise<GetProductOutput> {
    const product = await this.productService.findOne({ id })
    return { product}
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ type: GetProductOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateProductInput,
  ): Promise<GetProductOutput> {
    return await this.productService.update(
      req.user,
      id,
      input,
    )
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ) {
    return await this.productService.remove(
      req.user,
      id,
    )
  }
}