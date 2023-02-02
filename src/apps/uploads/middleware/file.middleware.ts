import { Injectable, mixin, NestInterceptor, Type } from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface"
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v4 as uuid } from 'uuid'
import { MAX_FILE_UPLOAD } from "../constants"

const cloudinary = require("cloudinary").v2;

interface UploadFileInterceptorProps {
  fieldName: string
  path?: string
  fileFilter?: MulterOptions['fileFilter']
  limits?: MulterOptions['limits']
  isMulti: boolean
}

export function UploadFileInterceptor(options: UploadFileInterceptorProps): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor
    constructor() {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      })

      const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          public_id: (req, file) => `${options.path}/${uuid()}`
        },
      });

      const multerOptions: MulterOptions = {
        storage,
        fileFilter: options.fileFilter,
        limits: options.limits,
      }

      if (options.isMulti) {
        this.fileInterceptor = new (FilesInterceptor(options.fieldName, MAX_FILE_UPLOAD, multerOptions))
      } else {
        this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions))
      }

    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args)
    }
  }

  return mixin(Interceptor)
}
