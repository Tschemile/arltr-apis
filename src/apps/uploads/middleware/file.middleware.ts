import { Injectable, mixin, NestInterceptor, Type } from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface"
import { diskStorage } from "multer"
import { FOLDER_UPLOAD, MAX_FILE_UPLOAD } from "../constants"
import { editFileName } from "../utils"

interface UploadFileInterceptor {
  fieldName: string
  path?: string
  fileFilter?: MulterOptions['fileFilter']
  limits?: MulterOptions['limits']
}

export function SingleFileInterceptor(options: UploadFileInterceptor): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor
    constructor() {
      const destination = `${FOLDER_UPLOAD}/${options.path}`

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: editFileName,
        }),
        fileFilter: options.fileFilter,
        limits: options.limits,
      }

      this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions))
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args)
    }
  }

  return mixin(Interceptor)
}

export function MultipleFileInterceptor(options: UploadFileInterceptor): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor
    constructor() {
      const destination = `${FOLDER_UPLOAD}/${options.path}`

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: editFileName,
        }),
        fileFilter: options.fileFilter,
        limits: options.limits,
      }

      this.fileInterceptor = new (FilesInterceptor(options.fieldName, MAX_FILE_UPLOAD, multerOptions))
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args)
    }
  }

  return mixin(Interceptor)
}