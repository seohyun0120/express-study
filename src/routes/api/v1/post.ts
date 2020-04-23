import express from 'express';
import PostController from '../../../controllers/post.controller';
import CommentController from '../../../controllers/comment.controller';
import FileController from '../../../controllers/file.controller';

const router = express.Router();
router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPost);
router.post('/', FileController.uploadSingleFile, PostController.createPost);
router.patch('/:id', FileController.uploadSingleFile, PostController.updatePost);
router.delete('/:id', PostController.deletePost);

router.patch('/:id/comments', CommentController.createComment);
router.patch('/:id/comments/:commentId', CommentController.updateComment);
router.delete('/:id/comments/:commentId', CommentController.deleteComment);

export default router;