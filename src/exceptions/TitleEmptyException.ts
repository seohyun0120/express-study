import HttpException from './HttpException';

class TitleEmptyException extends HttpException {
  constructor() {
    super(400, false, 4, `Title cannot be empty string`);
  };
}

export default TitleEmptyException;