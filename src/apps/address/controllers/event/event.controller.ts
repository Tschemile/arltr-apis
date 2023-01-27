import { Body, Post, UseGuards, Request, Get, Query, Param, Patch, Delete, Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateEventDto, GetEventOutput, GetEventsOutput, UpdateEventDto } from 'apps/address/dtos/event';
import { EventService } from 'apps/address/services';
import { JwtAuthGuard } from 'apps/auth';
import { TableName } from 'utils';


@ApiTags(TableName.EVENT)
@Controller(TableName.EVENT.toLowerCase())
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetEventOutput })
  async create(
      @Body() createEventDto: CreateEventDto,
    @Request() req,
  ) {
    return await this.eventService.create(req.user, createEventDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'addressIds', required: false, type: [String] })
  @ApiQuery({ name: 'groupIds', required: false, type: [String] })
  @ApiOkResponse({
    description: 'Get events list',
  })
  async findAll(
    @Query('search') search,
    @Query('limit') limit,
    @Query('addressIds') addressIds,
    @Query('groupIds') groupIds,
  ): Promise<GetEventsOutput> {
    return await this.eventService.findAll({ search, limit, addressIds, groupIds });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<GetEventOutput> {
    return await this.eventService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req) {
   return await this.eventService.update(req.user, updateEventDto, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    return await this.eventService.remove( req.user, id);
  }
}
