import { forwardRef, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileModule } from "apps/profiles";
import { FileController } from "../controllers/file";
import { File } from "../entities";
import { FileService } from "../services";

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      dest: './public',
    }),
    forwardRef(() => ProfileModule)
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class UploadModule { }