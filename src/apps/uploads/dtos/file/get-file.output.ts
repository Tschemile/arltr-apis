import { ApiProperty } from "@nestjs/swagger";
import { File } from "apps/uploads/entities";

export class GetFileOutput {
  @ApiProperty({ type: () => File })
  file: File
}

export class GetFilesOutput {
  @ApiProperty({ type: () => [File] })
  files: File[]

  @ApiProperty({ type: Number })
  total: number
}