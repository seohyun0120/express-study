import express, { Request, Response } from 'express';
import { PostModel, IPost } from '../../../models/post';
import { isNull, map, omit } from 'lodash';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({}).lean();
    const result = map(posts, (p) => omit(p, '__v'));
    return res.status(200).json({
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 500,
        message: 'Internal Server Error'
      }
    });
  }
});

router.get('/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const post = await PostModel.findById(postId).lean();
    if (isNull(post)) {
      return res.status(404).json({
        error: {
          code: 1,
          message: `postID '${postId}' Not found.`
        }
      });
    }
    const result = omit(post, '__v');
    return res.status(200).json({
      data: result
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(404).json({
        error: {
          code: 1,
          message: `postId '${postId} Not found.`
        }
      })
    }
    return res.status(500).json({
      error: {
        code: 500,
        message: 'Internal Server Error'
      }
    });
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { author, title, content } = req.body as IPost;
    if (author === '' && title === '') {
      return res.status(400).json({
        error: {
          code: 2,
          message: 'Author and Title cannot be empty string'
        }
      });
    } else if (author === '') {
      return res.status(400).json({
        error: {
          code: 3,
          message: 'Author cannot be empty string'
        }
      });
    } else if (title === '') {
      return res.status(400).json({
        error: {
          code: 4,
          message: 'Title cannot be empty string'
        }
      });
    } else {
      const post = await new PostModel({
        title,
        author,
        content,
      }).save();
      const result = omit(post.toObject(), '__v');

      return res.status(201).json({
        data: result
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 500,
        message: 'Internal Server Error'
      }
    });
  }
});

router.patch('/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const { title, content } = req.body;
    const post = await PostModel.findByIdAndUpdate(postId, {
      title,
      content
    }, { new: true });
    if (isNull(post)) {
      return res.status(404).json({
        error: {
          code: 1,
          message: `postID '${postId}' Not found.`
        }
      });
    } else if (title === '') {
      return res.status(400).json({
        error: {
          code: 4,
          message: 'Title cannot be empty string'
        }
      });
    } else {
      const result = omit(post, '__v');
      return res.status(201).json({
        data: result
      });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(404).json({
        error: {
          code: 1,
          message: `postId '${postId} Not found.`
        }
      })
    };

    return res.status(500).json({
      error: {
        code: 500,
        message: 'Internal Server Error'
      }
    });
  }
})

router.delete('/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const post = await PostModel.findByIdAndDelete(postId);
    if (isNull(post)) {
      return res.status(404).json({
        error: {
          code: 1,
          message: `postID '${postId}' Not found.`
        }
      });
    } else {
      return res.status(200).json(
        'Successfully deleted'
      );
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(404).json({
        error: {
          code: 1,
          message: `postId '${postId} Not found.`
        }
      })
    }

    return res.status(500).json({
      error: {
        code: 500,
        message: 'Internal Server Error'
      }
    });
  }
})

export default router;