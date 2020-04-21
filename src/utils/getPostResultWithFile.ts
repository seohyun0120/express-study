import { IPost } from "../../src/interfaces/IPost";
import IFile from "../../src/interfaces/IFile";
import { FileModel } from "../../src/models";

export default async function getPostResultWithFile(post: IPost) {
  const file: IFile = post.fileId ? await FileModel.findOne({ _id: post.fileId }) : null;
  return { ...post.toObject({ versionKey: false }), file };
}
