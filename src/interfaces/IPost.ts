import { Document } from 'mongoose';
import IFile from './IFile';

interface IPost extends Document {
  author: string;
  title: string;
  content: string;
  viewNum: number;
  comments: IComment[];
  fileId: string;
}

interface IPostWithFile extends Document {
  author: string;
  title: string;
  content: string;
  viewNum: number;
  comments: IComment[];
  fileId: string;
  file: IFile;
}

interface IComment extends Document {
  author: string;
  text: string;
}

interface IPostMongooseResult {
  _id: string;
  title: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  viewNum: number;
  comments: [
    {
      _id: string;
      author: string;
      text: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ];
  fileId: string;
}

interface IPostResult {
  _id: string;
  title: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  viewNum: number;
  comments: [
    {
      _id: string;
      author: string;
      text: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ]
  fileId: string;
}

interface IGetQueryParams {
  page: string;
  limit: string;
  orderBy: Order;
}

interface IGetPostResult {
  post: IPost;
  file: IFile;
}

enum Order {
  desc = 'desc',
  asc = 'asc'
}

interface IGetPostsResult {
  totalCount: number;
  page: number;
  limit: number;
  posts: IPostResult[]
}

interface ICreatePost {
  author: string;
  title: string;
  content?: string;
  fileId: string;
}

interface ICreateComment {
  author: string;
  text: string;
}

interface IUpdatePost {
  title: string;
  content?: string;
  fileId: string;
}

interface IUpdateComment {
  text: string;
}

export {
  IPost,
  IPostWithFile,
  ICreatePost,
  ICreateComment,
  IUpdatePost,
  IUpdateComment,
  IPostMongooseResult,
  IPostResult,
  IGetPostsResult,
  IGetPostResult,
  IGetQueryParams,
  Order,
}