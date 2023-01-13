import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateProductInput, GetProductOutput, GetProductsOutput, UpdateProductInput } from "apps/shop/dtos";
import { ProductService } from "apps/shop/services";
import { HTTP_STATUS } from "utils";

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
    const { status, product } = await this.productService.create(req.user, input)

    if (status === HTTP_STATUS.Bad_Request) {
      return {
        status,
        message: 'Invalid request'
      }
    }

    return {
      status,
      product,
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetProductOutput })
  async getById(
    @Param('id') id: string,
  ): Promise<GetProductOutput> {
    const product = await this.productService.findOne({ id })

    return {
      status: HTTP_STATUS.OK,
      product,
    }
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
    const { status, product } = await this.productService.update(
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
        message: `You don't have permission to do it`,
      }
    } else if (status === HTTP_STATUS.Bad_Request) {
      return {
        status,
        message: 'Invalid request'
      }
    }

    return {
      status,
      product,
    }
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
    const { status } = await this.productService.remove(
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
        message: `You don't have permission to do it`,
      }
    }

    return {
      status,
      message: 'Deleted successfully',
    }
  }
}