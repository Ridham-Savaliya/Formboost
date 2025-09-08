import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { GenerateError } from '#utils/exception.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExt);
    cb(null, `${baseName}-${uniqueSuffix}${fileExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new GenerateError({
        name: 'FileTypeError',
        message: 'Only JPEG, PNG, and PDF files are allowed.',
        status: 400,
      })
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

export default upload;
