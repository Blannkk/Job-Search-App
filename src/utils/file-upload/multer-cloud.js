import fs from "fs";
import path from "path";
import multer, { diskStorage } from "multer";
import { fileTypeFromBuffer } from "file-type";
import { nanoid } from "nanoid";

export const fileValidation = {
  images: ["image/jpeg", "image/png", "image/jpg"],
  files: ["application/pdf", "application/msword"],
  videos: ["video/mp4", "video/mpeg"],
};
export const cloudUpload = (allowedTypes, folder) => {
  try {
    const storage = diskStorage({});

    const fileFilter = (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error("file type not supported"), false);
      }
      return cb(null, true);
    };
    return multer({ storage, fileFilter });
  } catch (error) {
    return next(error);
  }
};

export const fileTypeValidation = async (
  req,
  res,
  next
) => {
  try {
    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const type = await fileTypeFromBuffer(buffer);
    const allowedTypes = [
      ...fileValidation.images,
      ...fileValidation.files,
      ...fileValidation.videos,
    ];
    if (!type || !allowedTypes.includes(type.mime)) {
      return next(new Error("invalid file type"));
    }
  } catch (error) {
    return next(error);
  }
};
