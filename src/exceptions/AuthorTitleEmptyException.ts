import HttpException from './HttpException';

class AuthorTitleEmptyException extends HttpException {
  constructor() {
    super(400, false, 2, `Author and Title cannot be empty string`);
  };
}

export default AuthorTitleEmptyException;