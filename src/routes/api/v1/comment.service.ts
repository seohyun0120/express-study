import { isNull } from 'lodash';
import { IPostResult, IPost } from '../../../Interfaces/IPost';
import { PostModel } from '../../../models/post';
import Exceptions from '../../../exceptions';

const createComment = async (
  id: string,
  author: string,
  text: string
) => {
  if (author === '' && text === '') {
    throw new Exceptions.AuthorTitleAreEmptyException();
  } else if (author === '') {
    throw new Exceptions.AuthorIsEmptyException();
  } else if (text === '') {
    throw new Exceptions.TextIsEmptyException();
  }

  const post: IPost = await PostModel.findByIdAndUpdate(
    id,
    { $push: { "comments": { author, text } } },
    { new: true }
  );

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

const updateComment = async (id: string, commentId: string, text: string) => {
  if (text === '') {
    throw new Exceptions.TextIsEmptyException();
  }

  const post: IPost = await PostModel.findOneAndUpdate(
    { _id: id, "comments._id": commentId },
    { $set: { "comments.$.text": text } },
    { new: true }
  );

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  } else if (text === '') {
    throw new Exceptions.TextIsEmptyException();
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

const deleteComment = async (id: string, commentId: string) => {
  const post: IPost = await PostModel.findByIdAndUpdate(
    { "_id": id },
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  );

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

export default {
  createComment,
  updateComment,
  deleteComment
}