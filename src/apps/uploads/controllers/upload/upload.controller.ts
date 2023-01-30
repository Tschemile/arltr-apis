import { Body, Controller, Post, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { IMAGE_LIMIT, UPLOAD_TYPE } from "apps/uploads/constants";
import { FileUploadInput, FileUploadMultiInput } from "apps/uploads/dtos";
import { MultipleFileInterceptor, SingleFileInterceptor } from "apps/uploads/middleware";
import { FileService } from "apps/uploads/services";
import { formatInfoFile, imageFileFilter } from "apps/uploads/utils";
import { TableName } from "utils";

@ApiTags(TableName.UPLOAD)
@Controller(TableName.UPLOAD.toLowerCase())
export class UploadController {
  constructor(
    private readonly fileService: FileService
  ) { }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SingleFileInterceptor({
    fieldName: 'file',
    path: 'images',
    fileFilter: imageFileFilter,
    limits: {
      fileSize: IMAGE_LIMIT,
    }
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
    @Body('type') type?: UPLOAD_TYPE,
  ) {
    const fileInput = formatInfoFile(file, req.headers.host)
    return await this.fileService.create(
      req.user,
      fileInput,
      type,
    )
  }

  @Post('image/multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MultipleFileInterceptor({
    fieldName: 'files',
    path: 'images',
    fileFilter: imageFileFilter,
    limits: {
      fileSize: IMAGE_LIMIT,
    }
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
    const fileInputs = files.map((x) => {
      return formatInfoFile(x, req.headers.host)
    })
    return await this.fileService.createMultiple(
      req.user,
      fileInputs,
    )
  }
}