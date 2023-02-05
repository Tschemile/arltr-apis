import { Body, Controller, Delete, Get, Param, Patch, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { GetFileOutput, GetFilesOutput, UpdateFileInput } from "apps/uploads/dtos";
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
  ): Promise<GetFilesOutput> {
    return await this.fileService.findAll(req.user, { user, limit })
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: GetFileOutput })
  async patch(
    @Request() req,
    @Param('id') id: string,
    @Body() input: UpdateFileInput,
  ): Promise<GetFileOutput> {
    return await this.fileService.update(req.user, id, input)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: GetFileOutput })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ): Promise<GetFileOutput> {
    return await this.fileService.remove(req.user, id)
  }
}