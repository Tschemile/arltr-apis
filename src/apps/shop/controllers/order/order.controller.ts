import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateOrderInput, UpdateOrderInput } from "apps/shop/dtos";
import { GetOrderOutput } from "apps/shop/dtos/order/get-order.output";
import { OrderService } from "apps/shop/services";
import { ModuleName } from "utils";

@ApiTags(ModuleName.ORDER)
@Controller(ModuleName.ORDER.toLowerCase())
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) { }

  @Post()
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${ModuleName.ORDER} not found` })
  @ApiCreatedResponse({ type: GetOrderOutput })
  async post(
    @Request() req,
    @Body() input: CreateOrderInput
  ): Promise<GetOrderOutput> {
    return await this.orderService.create(req.user, input)
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetOrderOutput })
  async getById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<GetOrderOutput> {
    return await this.orderService.findById(req.user, id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${ModuleName.ORDER} not found` })
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
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: `${ModuleName.ORDER} not found` })
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