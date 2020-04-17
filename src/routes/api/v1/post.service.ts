import { isNull, map, omit } from 'lodash';
import { GridFSBucket, ObjectID } from 'mongodb';
import { IPostMongooseResult, IPostResult, IPost, IGetPostsResult, IGetQueryParams, Order, IPostWithFile } from '../../../Interfaces/IPost';
import IFile from '../../../interfaces/IFile';
import { PostModel } from '../../../models/post';
import { FileModel } from '../../../models/file';
import Exceptions from '../../../exceptions';
import isEmptyOrSpaces from '../../../utils/isEmptyOrSpaces';
import { storage } from '.';
import { Response } from 'express';

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

  // 해당 post가 있는지 확인후 post에 저장
  post = await PostModel.findOneAndUpdate(
    idQueryOption,
    { $inc: { viewNum: 1 } },
    { new: true }
  ).sort(sortOption);

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  }

  // post.fileId가 존재하면, gridFS에서 값을 가져와 post에 부가적인 값을 넣어준다.
  file = post.fileId ? await FileModel.findOne({ _id: post.fileId }) : null;

  const result: IPostWithFile = { ...post.toObject({ versionKey: false }), file };
  return result;
}

const getPostFile = async (fileId: string, res: Response) => {
  const gridFSBucket = new GridFSBucket(storage.db, { 'bucketName': 'uploadFiles' });
  const stream = gridFSBucket.openDownloadStream(new ObjectID(fileId));
  return stream
    .on('error', (err: any) => {
      if (err.code === 'ENOENT') {
        throw new Exceptions.FileNotFoundException();
      }
    })
    .pipe(res);
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

export default { getPosts, getPost, getPostFile, createPost, updatePost, deletePost };
