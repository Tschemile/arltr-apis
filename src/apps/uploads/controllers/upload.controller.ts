import { Body, Controller, Get, Param, Post, Response, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { FileUploadInput } from "../dtos";
import { editFileName, imageFileFilter } from "../utils";

const MODULE_NAME = 'Upload'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class UploadController {

  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadInput,
  })
  upload(
    @UploadedFile() file: Express.Multer.File
  ) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Get(':path')
  @ApiParam({ name: 'path' })
  getFile(
    @Param('path') path,
    @Response() res,
  ) {
    return res.sendFile(path, { root: './public' })
  }
}