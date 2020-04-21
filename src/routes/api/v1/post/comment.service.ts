import { isNull } from 'lodash';
import Exceptions from '../../../../exceptions';
import IFile from '../../../../Interfaces/IFile';
import { PostModel, FileModel } from '../../../../models';
import isEmptyOrSpaces from '../../../../utils/isEmptyOrSpaces'
import { IPost, IPostWithFile } from '../../../../Interfaces/IPost';

const createComment = async (
  id: string,
  author: string,
  text: string
) => {
  let file: IFile;
  let post: IPost;
  if (isEmptyOrSpaces(author) && isEmptyOrSpaces(text)) {
    throw new Exceptions.AuthorTitleAreEmptyException();
  } else if (isEmptyOrSpaces(author)) {
    throw new Exceptions.AuthorIsEmptyException();
  } else if (isEmptyOrSpaces(text)) {
    throw new Exceptions.TextIsEmptyException();
  }

  post = await PostModel.findByIdAndUpdate(
    id,
    { $push: { "comments": { author, text } } },
    { new: true }
  );

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  }

  file = post.fileId ? await FileModel.findOne({ _id: post.fileId }) : null;

  const result: IPostWithFile = { ...post.toObject({ versionKey: false }), file };
  return result;
}

const updateComment = async (id: string, commentId: string, text: string) => {
  let post: IPost;
  let file: IFile;
  if (isEmptyOrSpaces(text)) {
    throw new Exceptions.TextIsEmptyException();
  }

  post = await PostModel.findOneAndUpdate(
    { _id: id, "comments._id": commentId },
    { $set: { "comments.$.text": text } },
    { new: true }
  );

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  } else if (isEmptyOrSpaces(text)) {
    throw new Exceptions.TextIsEmptyException();
  }

  file = post.fileId ? await FileModel.findOne({ _id: post.fileId }) : null;

  const result: IPostWithFile = { ...post.toObject({ versionKey: false }), file };
  return result;
}

const deleteComment = async (id: string, commentId: string) => {
  let post: IPost;
  let file: IFile;

  post = await PostModel.findOneAndUpdate(
    { "_id": id, "comments._id": commentId },
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  );

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  }

  file = post.fileId ? await FileModel.findOne({ _id: post.fileId }) : null;

  const result: IPostWithFile = { ...post.toObject({ versionKey: false }), file };
  return result;
}

export default {
  createComment,
  updateComment,
  deleteComment
}