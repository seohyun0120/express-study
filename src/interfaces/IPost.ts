import { Document } from 'mongoose';

interface IPost extends Document {
  author: string;
  title: string;
  content: string;
}

interface IPostMongooseResult {
  _id: string;
  title: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface IPostResult {
  _id: string;
  title: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ICreatePost {
  author: string;
  title: string;
  content?: string;
}

interface IUpdatePost {
  title: string;
  content?: string;
}

export {
  IPost,
  ICreatePost,
  IUpdatePost,
  IPostMongooseResult,
  IPostResult,
}