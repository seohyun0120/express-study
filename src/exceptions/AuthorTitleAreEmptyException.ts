import HttpException from './HttpException';

class AuthorTitleAreEmptyException extends HttpException {
  constructor() {
    super(400, false, 2, `Author and Title cannot be empty string`);
  };
}

export default AuthorTitleAreEmptyException;