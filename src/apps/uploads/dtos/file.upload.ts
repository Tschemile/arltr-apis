import { ApiProperty } from "@nestjs/swagger";
import { UPLOAD_TYPE } from "../constants";

export class FileUploadInput {
  @ApiProperty({ type: String, format: 'binary' })
  file: any

  @ApiProperty({ type: String, enum: UPLOAD_TYPE, required: false })
  type: string
}

export class FileInput {
  filename: string
  path: string
  mimetype: string
  size: number
}