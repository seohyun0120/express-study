import HttpException from './HttpException';

class CommentNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, 7, `commentId ${id} Not found`);
  };
}

export default CommentNotFoundException;