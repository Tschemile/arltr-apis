import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadController } from "../controllers";

@Module({
  imports: [
    MulterModule.register({
      dest: './public',
    })
  ],
  controllers: [UploadController]
})
export class UploadModule { }