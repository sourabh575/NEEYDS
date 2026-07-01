import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
  },
});

const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype.startsWith("image/")) {
    const error = new Error(
      `Invalid file type for "${file.originalname}". Only image files are allowed.`,
    );
    error.statusCode = 400;
    return callback(error);
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    files: MAX_FILES,
    fileSize: MAX_FILE_SIZE,
  },
});

const uploadErrorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "Each image must be 5MB or smaller.",
      LIMIT_FILE_COUNT: "A maximum of 5 images can be uploaded.",
      LIMIT_UNEXPECTED_FILE: "An unexpected image field was provided.",
    };

    return res.status(400).json({
      message: messages[error.code] ?? `Image upload failed: ${error.message}`,
    });
  }

  if (error?.statusCode === 400) {
    return res.status(400).json({ message: error.message });
  }

  next(error);
};

export { uploadErrorHandler };
export default upload;
