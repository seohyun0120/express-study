import { isNull } from "lodash";
import { GridFSBucket } from 'mongodb';
import { Response, Request } from 'express';
import { storage } from "../post/index";
import IFile from "../../../../interfaces/IFile";
import { FileModel } from "../../../../models";
import Exceptions from '../../../../exceptions';
import { getDownloadFilename } from "../../../../utils";

const getFile = async (filename: string, req: Request, res: Response) => {
  const file: IFile = await FileModel.findOne({ filename });
  if (isNull(file)) {
    throw new Exceptions.FileNotFoundException(filename);
  }

  const mimetype = file.contentType;

  res.writeHead(200, {
    'Content-Type': mimetype,
    'Content-Disposition': 'inline; filename=' + getDownloadFilename(req, file.metadata.originalname)
  });

  const gridFSBucket = new GridFSBucket(storage.db, { 'bucketName': 'uploadFiles' });
  const stream = gridFSBucket.openDownloadStreamByName(filename);
  stream
    .on('error', (err) => {
      console.log(err);
      res.end();
    })
    .on('finish', () => {
      console.log('done');
      process.exit(0);
    });
  return stream.pipe(res);
}

export default { getFile }