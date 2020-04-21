import express from 'express';
import PostController from './post.controller';
import CommentController from './comment.controller';
import { fileUploader } from '../../../../utils';

const router = express.Router();
router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPost);
router.post('/', fileUploader.upload, PostController.createPost);
router.patch('/:id', fileUploader.upload, PostController.updatePost);
router.delete('/:id', PostController.deletePost);

router.patch('/:id/comments', CommentController.createComment);
router.patch('/:id/comments/:commentId', CommentController.updateComment);
router.delete('/:id/comments/:commentId', CommentController.deleteComment);

export default router;