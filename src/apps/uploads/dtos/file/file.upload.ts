import { ApiProperty, OmitType } from "@nestjs/swagger";
import { FILE_SCOPE, UPLOAD_TYPE } from "apps/uploads/constants";

export class FileUploadInput {
  @ApiProperty({ type: String, format: 'binary' })
  file: any

  @ApiProperty({ type: String, enum: UPLOAD_TYPE, required: false })
  type: string

  @ApiProperty({ type: String, required: false })
  album: string

  @ApiProperty({ type: String, enum: FILE_SCOPE, required: false })
  scope: string
}

export class FileUploadMultiInput {
  @ApiProperty({ type: [String], format: 'binary' })
  files: any
}

export class FileMetaInput extends OmitType(FileUploadInput, ['file'] as const) {}