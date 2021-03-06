import HttpException from './HttpException';

class AuthorIsEmptyException extends HttpException {
  constructor() {
    super(400, 3, `Author cannot be empty string`);
  };
}

export default AuthorIsEmptyException;