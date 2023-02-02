import { Controller, Delete, Get, Param, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { GetFilesOutput } from "apps/uploads/dtos";
import { FileService } from "apps/uploads/services";
import { TableName } from "utils";

@ApiTags(TableName.FILE)
@Controller(TableName.FILE.toLowerCase())
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) { }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'user' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({ type: GetFilesOutput})
  async gets(
    @Request() req,
    @Query('user') user: string,
    @Query('limit') limit: number,
  ) {
    return await this.fileService.findAll(req.user, { user, limit })
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: GetFilesOutput})
  async delete(
    @Request() req,
    @Param('id') id: string,
  ) {
    return await this.fileService.remove(req.user, id)
  }
}