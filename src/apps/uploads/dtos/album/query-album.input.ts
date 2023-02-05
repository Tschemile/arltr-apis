import { IsNotEmpty, IsUUID } from "class-validator";

export class QueryAlbumInput {
  @IsUUID()
  @IsNotEmpty()
  user: string
}