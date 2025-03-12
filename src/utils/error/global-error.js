import fs from "fs";
import path from "path";
export const globalError = (err, req, res, next) => {
  // check if there a file uploaded and delete it
  if (req.file) {
    const fullPath = path.resolve(req.file.path);
    fs.unlinkSync(fullPath);
  }
  return res.status(err.cause || 500).json({
    success: false,
    error: err.message,
    stack: err.stack,
  });
};
