import { isNull, map, omit, isUndefined } from 'lodash';
import Exceptions from '../../../../exceptions';
import IFile from '../../../../interfaces/IFile';
import { PostModel, FileModel } from '../../../../models';
import { isEmptyOrSpaces, getPostResultWithFile } from '../../../../utils';
import { IPostMongooseResult, IPostResult, IPost, IGetPostsResult, IGetQueryParams, Order, IPostResultWithFile } from '../../../../Interfaces/IPost';

const getPosts = async (query: IGetQueryParams) => {
  const page = query ? parseInt(query.page) : 1;
  const limit = query ? parseInt(query.limit) : 10;
  const orderBy = query.orderBy ? query.orderBy : Order.desc;
  const totalCount = await PostModel.countDocuments({});

  const posts: IPostMongooseResult[] = await PostModel.find({}).skip((page - 1) * limit).limit(limit).sort({ _id: orderBy }).lean();
  const posts_lean: IPostResult[] = map(posts, (p) => omit(p, '__v'));
  const result: IGetPostsResult = { totalCount, page, limit, posts: posts_lean };
  return result;
}

const getPost = async (id: string, type: string) => {
  let post: IPost;
  let file: IFile;
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

  // file = post.fileId ? await FileModel.findOne({ _id: post.fileId }) : null;
  // const result: IPostResultWithFile = { ...post.toObject({ versionKey: false }), file };
  const result: IPostResultWithFile = await getPostResultWithFile(post);
  return result;
}

const createPost = async (
  author: string,
  title: string,
  content?: string,
  fileId?: string
) => {
  if (isEmptyOrSpaces(author) && isEmptyOrSpaces(title)) {
    throw new Exceptions.AuthorTitleAreEmptyException();
  } else if (isEmptyOrSpaces(author)) {
    throw new Exceptions.AuthorIsEmptyException();
  } else if (isEmptyOrSpaces(title)) {
    throw new Exceptions.TitleIsEmptyException();
  }

  const post: IPost = await PostModel.create({
    title,
    author,
    content,
    fileId,
  });

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

const updatePost = async (id: string, title: string, content?: string, fileId?: string) => {
  let updatedPost: IPost;

  if (isUndefined(fileId)) {
    updatedPost = await PostModel.findByIdAndUpdate(id, {
      title,
      content,
    }, { new: true });
  } else {
    let beforePost = await PostModel.findById(id);
    await FileModel.findByIdAndDelete(beforePost.fileId);

    if (isNull(fileId)) {
      updatedPost = await PostModel.findByIdAndUpdate(id, {
        title,
        content,
        fileId: null
      }, { new: true });
    } else {
      updatedPost = await PostModel.findByIdAndUpdate(id, {
        title,
        content,
        fileId
      }, { new: true });
    }
  }

  if (isNull(updatedPost)) {
    throw new Exceptions.PostNotFoundException(id);
  } else if (isEmptyOrSpaces(title)) {
    throw new Exceptions.TitleIsEmptyException();
  }

  const result: IPostResult = updatedPost.toObject({ versionKey: false });
  return result;
}

const deletePost = async (id: string) => {
  const post: IPost = await PostModel.findByIdAndDelete(id);

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  }

  if (post.fileId) {
    const file = await FileModel.findByIdAndDelete(post.fileId);
    if (isNull(file)) {
      throw new Exceptions.FileNotFoundException(post.fileId);
    }
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

export default { getPosts, getPost, createPost, updatePost, deletePost };
