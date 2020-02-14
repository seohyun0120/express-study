import express from 'express';
import posts from './posts';

const router = express.Router();

router.use('/posts', posts);

export default router;