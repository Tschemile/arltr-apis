import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateProductInput, GetProductOutput, UpdateProductInput } from "apps/shop/dtos";
import { ProductService } from "apps/shop/services";
import { TableName } from "utils";

@ApiTags(TableName.PRODUCT)
@Controller(TableName.PRODUCT.toLowerCase())
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
    return await this.productService.findById(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${TableName.PRODUCT} not found` })
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
  @ApiNotFoundResponse({ description: `${TableName.PRODUCT} not found` })
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ): Promise<GetProductOutput> {
    return await this.productService.remove(
      req.user,
      id,
    )
  }
}