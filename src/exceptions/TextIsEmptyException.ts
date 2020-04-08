import HttpException from './HttpException';

class TextIsEmptyException extends HttpException {
  constructor() {
    super(400, 6, `Text cannot be empty string`);
  };
}

export default TextIsEmptyException;