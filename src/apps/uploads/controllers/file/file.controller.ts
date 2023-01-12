import { Body, Controller, Get, Param, Post, Query, Request, Response, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { diskStorage } from "multer";
import { HTTP_STATUS } from "utils";
import { UPLOAD_TYPE } from "../../constants";
import { FileInput, FileUploadInput } from "../../dtos";
import { FileService } from "../../services";
import { editFileName, imageFileFilter } from "../../utils";

const MODULE_NAME = 'File'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
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
    const { status } = await this.fileService.create(
      req.user,
      fileInput,
      type,
      req.headers.host,
    )
    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: 'Profile not found'
      }
    }

    return { status }
  }

  @Get('albums')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'domain' })
  @ApiQuery({ name: 'limit', required: false })
  async getByUser(
    @Request() req,
    @Query('domain') domain: string,
    @Query('limit') limit?: number,
  ) {
    const { files, total } = await this.fileService.findAll(req.user, domain, limit)
    return {
      status: HTTP_STATUS.OK,
      files,
      total,
    }
  }

  @Get(':path')
  @ApiParam({ name: 'path' })
  getFile(
    @Request() req,
    @Param('path') path,
    @Response() res,
  ) {
    console.log(req.headers.host)
    return res.sendFile(path, { root: './public' })
  }
}