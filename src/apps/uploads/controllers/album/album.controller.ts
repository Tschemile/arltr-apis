import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateAlbumInput, GetAlbumOutput, GetAlbumsOutput, UpdateAlbumInput } from "apps/uploads/dtos";
import { AlbumService } from "apps/uploads/services";
import { TableName } from "utils";

@ApiTags(TableName.ALBUM)
@Controller(TableName.ALBUM.toLowerCase())
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService
  ) { }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetAlbumOutput })
  async post(
    @Request() req,
    @Body() input: CreateAlbumInput,
  ): Promise<GetAlbumOutput> {
    return await this.albumService.create(req.user, input)
  }

  @Get('')
  @ApiBearerAuth()
  @ApiQuery({ name: 'domain' })
  @ApiOkResponse({ type: GetAlbumsOutput })
  async get(
    @Request() req,
    @Query('domain') domain: string,
  ): Promise<GetAlbumsOutput> {
    return await this.albumService.findAll(req.user, domain)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.ALBUM} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do with this ${TableName.ALBUM}` })
  @ApiOkResponse({ type: GetAlbumOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateAlbumInput,
  ): Promise<GetAlbumOutput> {
    return await this.albumService.update(req.user, id, input)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: `${TableName.ALBUM} not found` })
  @ApiForbiddenResponse({ description: `You don't have permission to do with this ${TableName.ALBUM}` })
  @ApiOkResponse({ type: GetAlbumOutput })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ): Promise<GetAlbumOutput> {
    return await this.albumService.remove(req.user, id)
  }
}