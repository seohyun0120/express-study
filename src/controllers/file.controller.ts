import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import MulterGridfsStorage from 'multer-gridfs-storage';
import mongooseLoader from '../loaders/mongoose';
import fileService from '../services/file.service';

const getFile = async (req: Request, res: Response, next: NextFunction) => {
  const { filename } = req.params;

  try {
    return await fileService.getFile(filename, req, res);
  } catch (exceptions) {
    return next(exceptions);
  }
}

const fileStorage = new MulterGridfsStorage({
  db: mongooseLoader(),
  file: (req, file) => {
    file.metadata = { originalname: file.originalname }
    return {
      filename: 'file_' + Date.now(),
      bucketName: 'uploadFiles',
      ...file
    }
  }
});

const uploadSingleFile = multer({ storage: fileStorage }).single('file');

export default { getFile, fileStorage, uploadSingleFile }