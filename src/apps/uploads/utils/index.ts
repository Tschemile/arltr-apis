import { extname } from "path"
import { FileInput } from "../dtos"

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0]
  const fileExtName = extname(file.originalname)
  const randomName = new Date().toISOString().replace(/:/g, '-')
  callback(null, `${name}-${randomName}${fileExtName}`)
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false)
  }
  callback(null, true)
}

export const generateUrlHttp = (baseUrl: string, path: string) => {
  return `https://${baseUrl}/api/file/${path}`
}

export function formatInfoFile(file: Express.Multer.File, host: string): FileInput {
  return {
    filename: file.filename,
    path: file.path,
    mimetype: file.mimetype,
    size: file.size,
    url: generateUrlHttp(host, file.filename)
  }
}