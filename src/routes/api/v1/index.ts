import express from 'express';
import PostController from './post.controller';

const router = express.Router();
router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPost);
router.post('/', PostController.createPost);
router.patch('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);

export default router;