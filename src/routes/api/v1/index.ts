import express from 'express';
import PostController from './post.controller';
import CommentController from './comment.controller';

const router = express.Router();
router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPost);
router.post('/', PostController.createPost);
router.patch('/:id', PostController.updatePost);
router.patch('/:id/comments', CommentController.createComment);
router.patch('/:id/comments/:commentId', CommentController.updateComment);
router.delete('/:id', PostController.deletePost);
router.delete('/:id/comments/:commentId', CommentController.deleteComment);

export default router;