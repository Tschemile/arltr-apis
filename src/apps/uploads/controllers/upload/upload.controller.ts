import { Body, Controller, Post, Request, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { IMAGE_LIMIT, UPLOAD_TYPE } from "apps/uploads/constants";
import { FileMetaInput, FileUploadInput, FileUploadMultiInput } from "apps/uploads/dtos";
import { UploadFileInterceptor } from "apps/uploads/middleware";
import { FileService } from "apps/uploads/services";
import { imageFileFilter } from "apps/uploads/utils";
import { ModuleName } from "utils";

@ApiTags(ModuleName.UPLOAD)
@Controller(ModuleName.UPLOAD.toLowerCase())
export class UploadController {
  constructor(
    private readonly fileService: FileService
  ) { }

  @Post('image')
  @UseInterceptors(UploadFileInterceptor({
    fieldName: 'file',
    path: 'images',
    fileFilter: imageFileFilter,
    limits: {
      fileSize: IMAGE_LIMIT,
    },
    isMulti: false,
  }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image',
    type: FileUploadInput,
  })
  async uploadImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() input: FileMetaInput,
  ) {
    return await this.fileService.create(
      req.user,
      file,
      input,
    )
  }

  @Post('image/multiple')
  @UseInterceptors(UploadFileInterceptor({
    fieldName: 'files',
    path: 'images',
    fileFilter: imageFileFilter,
    limits: {
      fileSize: IMAGE_LIMIT,
    },
    isMulti: true,
  }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload images',
    type: FileUploadMultiInput,
  })
  async uploadMultiple(
    @Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.fileService.createMultiple(
      req.user,
      files,
    )
  }
}