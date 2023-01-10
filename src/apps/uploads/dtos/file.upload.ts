import { ApiProperty } from "@nestjs/swagger";

export class FileUploadInput {
  @ApiProperty({ type: String, format: 'binary' })
  file: any
}