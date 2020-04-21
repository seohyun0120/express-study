import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { ICreatePost, IPostResult, IPostResultWithFile, IGetPostsResult } from '../interfaces/IPost';
import PostService from '../services/post.service';
import PostNotFoundException from '../exceptions/PostNotFoundException';

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const posts: IGetPostsResult = await PostService.getPosts(query);
    return res.status(200).json({ isSucceeded: true, data: posts });
  } catch (error) {
    return next(error);
  }
}

const getPost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const type = req.query.type;

  if (!isValidObjectId(id)) {
    return next(new PostNotFoundException(id));
  }

  try {
    const post: IPostResultWithFile = await PostService.getPost(id, type);
    return res.status(200).json({ isSucceeded: true, data: post });
  } catch (exceptions) {
    return next(exceptions);
  }
}

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { author, title, content } = req.body as ICreatePost;
  const fileId = req.file ? req.file.id : null;

  try {
    const post: IPostResult = await PostService.createPost(author, title, content, fileId);
    return res.status(201).json({ isSucceeded: true, data: post });
  } catch (exceptions) {
    return next(exceptions);
  }
}

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, content } = req.body;
  let post: IPostResult;

  if (!isValidObjectId(id)) {
    return next(new PostNotFoundException(id));
  }

  try {
    if (!req.file) {
      if (req.body.file === 'same') {
        post = await PostService.updatePost(id, title, content);
      } else if (req.body.file === 'deleted') {
        post = await PostService.updatePost(id, title, content, null);
      }
    } else {
      const fileId = req.file.id;
      post = await PostService.updatePost(id, title, content, fileId);
    }
    return res.status(201).json({ isSucceeded: true, data: post });
  } catch (exceptions) {
    return next(exceptions);
  }
}

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next(new PostNotFoundException(id));
  }

  try {
    const post: IPostResult = await PostService.deletePost(id);
    return res.status(200).json({ isSucceeded: true, data: post });
  } catch (exceptions) {
    return next(exceptions);
  }
}

export default { getPosts, getPost, createPost, updatePost, deletePost };