import HttpException from './HttpException';

class PostNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, 1, `postId ${id} Not found`);
  };
}

export default PostNotFoundException;