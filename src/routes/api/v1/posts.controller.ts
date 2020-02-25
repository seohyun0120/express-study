import { Request, Response } from 'express';
import { ICreatePost, IUpdatePost } from '../../../../src/interfaces/IPost';
import PostService from './post.services';
import { isValidObjectId } from 'mongoose';

const getPosts = async (req: Request, res: Response) => {
  try {
    const post = await PostService.getPosts({});
    return res.status(200).json({ isSucceeded: true, data: post });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 500,
        message: 'Internal Server Error'
      }
    });
  }
}

const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ isSucceeded: false, error: { code: 1, message: `postId '${id} is Not Found` } })
  }

  try {
    const post = await PostService.getPost(id);
    return res.status(200).json({ isSucceeded: true, data: post });
  } catch ([status, isSucceeded, code, message]) {
    return res.status(status).json({ isSucceeded: false, error: { code, message } });
  }
}

const createPost = async (req: Request, res: Response) => {
  const { author, title, content } = req.body as ICreatePost;
  try {
    const post = await PostService.createPost(author, title, content);
    return res.status(201).json({ isSucceeded: true, data: post });
  } catch ([status, isSucceeded, code, message]) {
    return res.status(status).json({ isSucceeded: false, error: { code, message } });
  }
}

const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body as IUpdatePost;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ isSucceeded: false, error: { code: 1, message: `postId '${id} is Not Found` } })
  }

  try {
    const post = await PostService.updatePost(id, title, content);
    return res.status(201).json({ isSucceeded: true, data: post });
  } catch ([status, isSucceeded, code, message]) {
    return res.status(status || 500).json({ isSucceeded: false, error: { code, message } });
  }
}

const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ isSucceeded: false, error: { code: 1, message: `postId '${id} is Not Found` } })
  }

  try {
    const post = await PostService.deletePost(id);
    return res.status(200).json({ isSucceeded: true, data: post });
  } catch ([status, isSucceeded, code, message]) {
    return res.status(status).json({ isSucceeded: false, error: { code, message } });
  }
}

export default { getPosts, getPost, createPost, updatePost, deletePost };