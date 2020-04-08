import { isNull, map, omit } from 'lodash';
import { IPostMongooseResult, IPostResult, IPost, IGetPostsResult } from '../../../Interfaces/IPost';
import { PostModel } from '../../../models/post';
import Exceptions from '../../../exceptions';
import isEmptyOrSpaces from '../../../utils/isEmptyOrSpaces';

const getPosts = async (query: any) => {
  const page = parseInt(query.page) || 1;
  const pageLimit = parseInt(query.pageLimit) || 10;
  const totalCount = await PostModel.countDocuments({});

  const posts: IPostMongooseResult[] = await PostModel.find({}).skip((page - 1) * pageLimit).limit(pageLimit).lean();
  const posts_lean: IPostResult[] = map(posts, (p) => omit(p, '__v'));
  const result: IGetPostsResult = { totalCount, page, pageLimit, data: posts_lean };
  return result;
}

const getPost = async (id: string) => {
  const post: IPost = await PostModel.findByIdAndUpdate(
    id,
    { $inc: { viewNum: 1 } },
    { new: true }
  );

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

const createPost = async (
  author: string,
  title: string,
  content?: string
) => {
  if (isEmptyOrSpaces(author) && isEmptyOrSpaces(title)) {
    throw new Exceptions.AuthorTitleAreEmptyException();
  } else if (isEmptyOrSpaces(author)) {
    throw new Exceptions.AuthorIsEmptyException();
  } else if (isEmptyOrSpaces(title)) {
    throw new Exceptions.TitleIsEmptyException();
  }

  const post: IPost = await PostModel.create({ title, author, content });
  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

const updatePost = async (id: string, title: string, content?: string) => {
  const post: IPost = await PostModel.findByIdAndUpdate(id, {
    title,
    content
  }, { new: true });

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  } else if (isEmptyOrSpaces(title)) {
    throw new Exceptions.TitleIsEmptyException();
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

const deletePost = async (id: string) => {
  const post: IPost = await PostModel.findByIdAndDelete(id);

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

export default { getPosts, getPost, createPost, updatePost, deletePost };
