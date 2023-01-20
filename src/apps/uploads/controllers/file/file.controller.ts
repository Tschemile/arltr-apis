import { Body, Controller, Get, Param, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiTags } from "@nestjs/swagger";
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

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadInput,
  })
  async upload(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type?: UPLOAD_TYPE,
  ) {
    const fileInput: FileInput = {
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    }
    return await this.fileService.create(
      req.user,
      fileInput,
      type,
      req.headers.host,
    )
  }

  @Get(':path')
  @ApiParam({ name: 'path' })
  getFile(
    @Request() req,
    @Param('path') path,
    @Response() res,
  ) {
    return res.sendFile(path, { root: './public' })
  }
}