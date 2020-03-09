import HttpException from './HttpException';

class AuthorTitleAreEmptyException extends HttpException {
  constructor() {
    super(400, 2, `Author and Title cannot be empty string`);
  };
}

export default AuthorTitleAreEmptyException;