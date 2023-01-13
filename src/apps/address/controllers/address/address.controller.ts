import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateAddressInput, GetAddressesOutput, GetAddressOutput, UpdateAddressInput } from "apps/address/dtos";
import { AddressService } from "apps/address/services";
import { JwtAuthGuard } from "apps/auth";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Address'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetAddressOutput })
  async post(
    @Request() req,
    @Body() input: CreateAddressInput,
  ): Promise<GetAddressOutput> {
    const address = await this.addressService.create(req.user, input)

    return {
      status: HTTP_STATUS.Created,
      address,
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetAddressesOutput })
  async gets(
    @Request() req,
  ): Promise<GetAddressesOutput> {
    const { addresses, total } = await this.addressService.findAll(req.user, 5)

    return {
      status: HTTP_STATUS.OK,
      addresses,
      total,
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: GetAddressOutput })
  async getById(
    @Param('id') id: string,
  ): Promise<GetAddressOutput> {
    const address = await this.addressService.findOne({ id })

    return {
      status: HTTP_STATUS.OK,
      address,
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that.`})
  @ApiOkResponse({ type: GetAddressOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateAddressInput,
  ): Promise<GetAddressOutput> {
    const { status, address } = await this.addressService.update(
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
        message: `You don't have permission to do that.`
      }
    }

    return {
      status,
      address,
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${MODULE_NAME} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that.`})
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ) {
    const { status } = await this.addressService.remove(
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
        message: `You don't have permission to do that.`
      }
    }

    return {
      status,
      message: 'Deleted successfully',
    }
  }
}