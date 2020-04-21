import express from 'express';
import posts from './api/v1/post';
import files from './api/v1/file';
const router = express.Router();

router.use('/api/v1/posts', posts);
router.use('/api/v1/files', files);

export default router;