import { Document } from 'mongoose';

interface IFile extends Document {
  length: string;
  chunkSize: string;
  uploadDate: Date;
  md5: string;
  filename: string;
  contentType: string;
  metadata: {
    originalname: string;
  }
}

export default IFile;