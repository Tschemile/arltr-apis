import { Controller, Get, Param, Request, Response, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { FileService } from "apps/uploads/services";
import { TableName } from "utils";

@ApiTags(TableName.FILE)
@Controller(TableName.FILE.toLowerCase())
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) { }

  @Get(':path')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'path' })
  getFile(
    @Request() req,
    @Param('path') path,
    @Response() res,
  ) {
    return res.sendFile(path, { root: './public' })
  }
}