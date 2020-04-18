import express from 'express';
import api from './api/v1/index';
import PostController from './api/v1/post.controller';
const router = express.Router();

router.use('/api/v1/posts', api);
router.get('/api/v1/download/:filename', PostController.getPostFile);

export default router;