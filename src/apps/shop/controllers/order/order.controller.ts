import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateOrderInput, UpdateOrderInput } from "apps/shop/dtos";
import { GetOrderOutput } from "apps/shop/dtos/order/get-order.output";
import { OrderService } from "apps/shop/services";
import { HTTP_STATUS } from "utils";

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
    const { status, order } = await this.orderService.create(req.user, input)
    
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: `${MODULE_NAME} not found`,
      }
    }

    return {
      status,
      order,
    }
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
      status: HTTP_STATUS.OK,
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
    const { status, order } = await this.orderService.update(
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
      order,
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
    const { status } = await this.orderService.remove(
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