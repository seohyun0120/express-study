import { isNull, map, omit } from 'lodash';
import { IPostMongooseResult, IPostResult, IPost, IGetPostsResult, IGetQueryParams, Order } from '../../../Interfaces/IPost';
import { PostModel } from '../../../models/post';
import Exceptions from '../../../exceptions';
import isEmptyOrSpaces from '../../../utils/isEmptyOrSpaces';

const getPosts = async (query: IGetQueryParams) => {
  const page = query ? parseInt(query.page) : 1;
  const limit = query ? parseInt(query.limit) : 10;
  const orderBy = query.orderBy ? query.orderBy : Order.desc;
  const totalCount = await PostModel.countDocuments({});

  const posts: IPostMongooseResult[] = await PostModel.find({}).skip((page - 1) * limit).limit(limit).sort({ _id: orderBy }).lean();
  const posts_lean: IPostResult[] = map(posts, (p) => omit(p, '__v'));
  const result: IGetPostsResult = { totalCount, page, limit, data: posts_lean };
  return result;
}

const getPost = async (id: string, type: string) => {
  let post: IPost;
  let idQueryOption: object;
  let sortOption: object;

  switch (type) {
    case 'prev':
      idQueryOption = { _id: { '$gt': id } };
      sortOption = { _id: 1 };
      break;
    case 'next':
      idQueryOption = { _id: { '$lt': id } };
      sortOption = { _id: -1 };
      break;
    default:
      idQueryOption = { _id: id };
      break;
  }

  post = await PostModel.findOneAndUpdate(
    idQueryOption,
    { $inc: { viewNum: 1 } },
    { new: true }
  ).sort(sortOption);

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
