import HttpException from './HttpException';

class AuthorEmptyException extends HttpException {
  constructor() {
    super(400, false, 3, `Author cannot be empty string`);
  };
}

export default AuthorEmptyException;