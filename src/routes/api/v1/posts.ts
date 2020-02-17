import express, { Request, Response, NextFunction } from 'express';
import { PostModel, IPost } from '../../../models/post';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    let posts = await PostModel.find({});
    res.status(200).json({
      data: posts
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
  try {
    const { postId } = req.params;
    let post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          code: 1,
          message: `postID '${postId}' Not found`
        }
      });
    }
    return res.status(200).json({
      data: {
        _id: post._id,
        author: post.author,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 500,
        message: 'Internal Server Error'
      }
    });
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { author, title, content } = req.body as IPost;
    if (author === '' && title === '') {
      return res.status(404).json({
        error: {
          code: 2,
          message: 'Author and Title cannot be empty string'
        }
      });
    } else if (author === '') {
      return res.status(404).json({
        error: {
          code: 3,
          message: 'Author cannot be empty string'
        }
      });
    } else if (title === '') {
      return res.status(404).json({
        error: {
          code: 4,
          message: 'Title cannot be empty string'
        }
      });
    } else {
      const post = new PostModel({
        title,
        author,
        content,
      });
      await post.save((err) => {
        if (err) {
          return next(err);
        } else {
          return res.status(201).json({
            data: {
              _id: post._id,
              author,
              title,
              content,
              createdAt: post.createdAt,
            }
          });
        }
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
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    let post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          code: 1,
          message: `postID '${postId}' Not found.`
        }
      });
    } else if (title === '') {
      return res.status(404).json({
        error: {
          code: 4,
          message: 'Title cannot be empty string'
        }
      });
    } else {
      await post.updateOne({
        title,
        content
      });
      return res.status(201).json({
        data: {
          _id: post._id,
          author: post.author,
          title,
          content,
          createdAt: post.createdAt,
        }
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
})

router.delete('/:postId', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    let deletePost = await PostModel.deleteOne({ _id: postId });
    if (deletePost.n === 0 && deletePost.deletedCount === 0) {
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
    return res.status(500).json({
      error: {
        code: 500,
        message: 'Internal Server Error'
      }
    });
  }
})

export default router;