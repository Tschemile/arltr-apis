import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateAddressInput, GetAddressesOutput, GetAddressOutput, UpdateAddressInput } from "apps/address/dtos";
import { AddressService } from "apps/address/services";
import { TableName } from "utils";

@ApiTags(TableName.ADDRESS)
@Controller(TableName.ADDRESS.toLowerCase())
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) { }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetAddressOutput })
  async post(
    @Request() req,
    @Body() input: CreateAddressInput,
  ): Promise<GetAddressOutput> {
    return await this.addressService.create(req.user, input)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetAddressesOutput })
  async gets(
    @Request() req,
  ): Promise<GetAddressesOutput> {
    return await this.addressService.findAll(req.user, 5)
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: GetAddressOutput })
  async getById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<GetAddressOutput> {
    return await this.addressService.findById(req.user, id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.ADDRESS} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that.`})
  @ApiOkResponse({ type: GetAddressOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateAddressInput,
  ): Promise<GetAddressOutput> {
    return await this.addressService.update(
      req.user,
      id,
      input,
    )
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.ADDRESS} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do that.`})
  @ApiOkResponse({ description: 'Deleted successfully' })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ): Promise<GetAddressOutput>  {
    return await this.addressService.remove(
      req.user,
      id,
    )
  }
}