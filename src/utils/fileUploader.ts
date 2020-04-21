import multer from 'multer';
import MulterGridfsStorage from 'multer-gridfs-storage';
import mongooseLoader from '../loaders/mongoose';

const storage = new MulterGridfsStorage({
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

const upload = multer({ storage }).single('file');

export default { storage, upload }