import HttpException from './HttpException';

class AuthorTextAreEmptyException extends HttpException {
  constructor() {
    super(400, 5, `Author and Text cannot be empty string`);
  };
}

export default AuthorTextAreEmptyException;