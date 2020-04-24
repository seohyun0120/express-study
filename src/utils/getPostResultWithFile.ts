import { IPost } from "../interfaces/IPost";
import IFile from "../interfaces/IFile";
import { FileModel } from "../models";

export default async function getPostResultWithFile(post: IPost) {
  const file: IFile = post.fileId ? await FileModel.findOne({ _id: post.fileId }) : null;
  return { ...post.toObject({ versionKey: false }), file };
}
