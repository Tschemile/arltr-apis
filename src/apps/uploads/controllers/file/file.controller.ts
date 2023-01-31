import { Controller, Get, Param, Response } from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { FileService } from "apps/uploads/services";
import { TableName } from "utils";

@ApiTags(TableName.FILE)
@Controller(TableName.FILE.toLowerCase())
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) { }

  @Get(':path')
  @ApiParam({ name: 'path' })
  getFile(
    @Param('path') path,
    @Response() res,
  ) {
    return res.sendFile(path, { root: './public' })
  }
}