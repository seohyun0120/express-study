import mongoose, { Schema } from 'mongoose';
import IFile from '../interfaces/IFile';

const FileSchema: Schema = new Schema({
  length: { type: Number, required: true },
  chunkSize: { type: Number, required: true },
  uploadDate: { type: Date, required: true },
  md5: { type: String, required: true },
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  metadata: {
    originalname: { type: String, required: true }
  }
});

const FileModel = mongoose.model<IFile>('File', FileSchema, 'uploadFiles.files');

export { FileModel };
