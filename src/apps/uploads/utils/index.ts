const cloudinary = require("cloudinary").v2

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false)
  }
  callback(null, true)
}

export const deleteFromCloudinary = async (publicId: string) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  })

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (result) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}