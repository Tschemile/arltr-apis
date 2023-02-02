import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateEventDto, GetEventOutput, GetEventsOutput, UpdateEventDto } from 'apps/address/dtos/event';
import { EventService } from 'apps/address/services';
import { TableName } from 'utils';


@ApiTags(TableName.EVENT)
@Controller(TableName.EVENT.toLowerCase())
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetEventOutput })
  async create(
      @Body() createEventDto: CreateEventDto,
    @Request() req,
  ) {
    return await this.eventService.create(req.user, createEventDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'addresses', required: false, type: [String] })
  @ApiQuery({ name: 'groups', required: false, type: [String] })
  @ApiOkResponse({
    description: 'Get events list',
  })
  async findAll(
    @Query('search') search,
    @Query('limit') limit,
    @Query('addresses') addresses,
    @Query('groups') groups,
  ): Promise<GetEventsOutput> {
    return await this.eventService.findAll({ search, limit, addresses, groups });
  }

  @Get(':id')
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<GetEventOutput> {
    return await this.eventService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req) {
   return await this.eventService.update(req.user, updateEventDto, id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    return await this.eventService.remove( req.user, id);
  }
}
