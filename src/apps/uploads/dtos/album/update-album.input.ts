import { PartialType } from "@nestjs/swagger";
import { CreateAlbumInput } from "./create-album.input";

export class UpdateAlbumInput extends PartialType(CreateAlbumInput) { }