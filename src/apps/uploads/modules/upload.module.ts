import { forwardRef, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileModule } from "apps/profiles";
import { AlbumController, FileController, UploadController } from "../controllers";
import { Album, File } from "../entities";
import { AlbumService, FileService } from "../services";

@Module({
  imports: [
    TypeOrmModule.forFeature([File, Album]),
    MulterModule.register({
      dest: './public',
    }),
    forwardRef(() => ProfileModule),
  ],
  controllers: [FileController, AlbumController, UploadController],
  providers: [FileService, AlbumService],
  exports: [FileService, AlbumService]
})
export class UploadModule { }