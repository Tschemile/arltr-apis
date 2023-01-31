import { Controller, Delete, Get, Param, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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