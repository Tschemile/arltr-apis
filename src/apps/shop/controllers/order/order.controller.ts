import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateOrderInput, UpdateOrderInput } from "apps/shop/dtos";
import { GetOrderOutput } from "apps/shop/dtos/order/get-order.output";
import { OrderService } from "apps/shop/services";

const MODULE_NAME = 'Order'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiCreatedResponse({ type: GetOrderOutput })
  async post(
    @Request() req,
    @Body() input: CreateOrderInput
  ): Promise<GetOrderOutput> {
    return await this.orderService.create(req.user, input)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetOrderOutput })
  async getById(
    @Param('id') id: string,
  ): Promise<GetOrderOutput> {
    const order = await this.orderService.findOne({ id })

    return {
      order,
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiOkResponse({ type: GetOrderOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateOrderInput,
  ): Promise<GetOrderOutput> {
    return await this.orderService.update(
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
    return await this.orderService.remove(
      req.user,
      id,
    )
  }
}