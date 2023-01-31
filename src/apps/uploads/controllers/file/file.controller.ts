import { Controller, Get, Param, Request, Response, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { diskStorage } from "multer";
import { TableName } from "utils";
import { UPLOAD_TYPE } from "../../constants";
import { FileInput, FileUploadInput } from "../../dtos";
import { FileService } from "../../services";
import { editFileName, imageFileFilter } from "../../utils";

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