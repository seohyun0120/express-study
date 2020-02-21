import express from 'express';
import api from './api/v1/index';
const router = express.Router();

router.use('/api/v1/posts', api);

export default router;