import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RESPONDED_TYPE } from 'apps/address/constants';
import {
  CreateRespondedDto,
  GetListRespondersOutput,
  GetRespondedOutput,
  UpdateRespondedDto,
} from 'apps/address/dtos';
import { RespondedService } from 'apps/address/services/responded/responded.service';
import { JwtAuthGuard } from 'apps/auth';
import { TableName } from 'utils';

@ApiTags(TableName.RESPONDED)
@Controller(TableName.RESPONDED.toLowerCase())
export class RespondedController {
  constructor(private readonly respondedService: RespondedService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetRespondedOutput })
  async create(@Body() createRespondedDto: CreateRespondedDto, @Request() req) {
    return await this.respondedService.create(createRespondedDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'events', required: false, type: [String] })
  @ApiQuery({ name: 'users', required: false, type: [String] })
  @ApiQuery({ name: 'type', enum: RESPONDED_TYPE })
  @ApiOkResponse({
    description: 'Get response list',
  })
  async findAll(
    @Query('search') search,
    @Query('limit') limit,
    @Query('events') events,
    @Query('users') users,
    @Query('type') type = RESPONDED_TYPE.GOING,
  ): Promise<GetListRespondersOutput> {
    return await this.respondedService.findAll({
      search,
      limit,
      events,
      users,
      type,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<GetRespondedOutput> {
    return await this.respondedService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateRespondedDto: UpdateRespondedDto,
    @Request() req,
  ) {
    return await this.respondedService.update(id, updateRespondedDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    return await this.respondedService.remove(id, req.user);
  }
}
