import { ApiProperty } from "@nestjs/swagger";
import { Album } from "apps/uploads/entities";

export class GetAlbumOutput {
  @ApiProperty({ type: () => Album })
  album: Album
}

export class GetAlbumsOutput {
  @ApiProperty({ type: () => [Album] })
  albums: Album[]
}