import express from 'express';
import multer from 'multer';
import PostController from './post.controller';
import CommentController from './comment.controller';
import mongooseLoader from '../../../loaders/mongoose'
import MulterGridfsStorage from 'multer-gridfs-storage';

const storage = new MulterGridfsStorage({
  db: mongooseLoader(),
  file: (req, file) => {
    return {
      filename: 'file_' + Date.now(),
      bucketName: 'uploadFiles',
      ...file
    }
  }
});

const upload = multer({ storage }).single('file');

const router = express.Router();
router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPost);
router.post('/', upload, PostController.createPost);
router.patch('/:id', PostController.updatePost);
router.patch('/:id/comments', CommentController.createComment);
router.patch('/:id/comments/:commentId', CommentController.updateComment);
router.delete('/:id', PostController.deletePost);
router.delete('/:id/comments/:commentId', CommentController.deleteComment);

export default router;