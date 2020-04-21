import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import CommentServcie from './comment.service';
import { ICreateComment, IUpdateComment } from '../../../../interfaces/IPost';
import PostNotFoundException from '../../../../exceptions/PostNotFoundException';
import CommentNotFoundException from '../../../../exceptions/CommentNotFoundException';

const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { author, text } = req.body as ICreateComment;

  if (!isValidObjectId(id)) {
    return next(new PostNotFoundException(id));
  }

  try {
    const post = await CommentServcie.createComment(id, author, text);
    return res.status(201).json({ isSucceeded: true, data: post });
  } catch (exceptions) {
    return next(exceptions);
  }
}

const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  const { id, commentId } = req.params;
  const { text } = req.body as IUpdateComment;

  if (!isValidObjectId(id)) {
    return next(new PostNotFoundException(id));
  } else if (!isValidObjectId(commentId)) {
    return next(new CommentNotFoundException(commentId));
  }

  try {
    const post = await CommentServcie.updateComment(id, commentId, text);
    return res.status(201).json({ isSucceeded: true, data: post });
  } catch (exceptions) {
    return next(exceptions);
  }
}

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const { id, commentId } = req.params;
  if (!isValidObjectId(id)) {
    return next(new PostNotFoundException(id));
  } else if (!isValidObjectId(commentId)) {
    return next(new CommentNotFoundException(id));
  }

  try {
    const post = await CommentServcie.deleteComment(id, commentId);
    return res.status(200).json({ isSucceeded: true, data: post });
  } catch (exceptions) {
    return next(exceptions);
  }
}

export default {
  createComment,
  updateComment,
  deleteComment,
}