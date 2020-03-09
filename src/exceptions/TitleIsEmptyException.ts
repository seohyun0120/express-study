import HttpException from './HttpException';

class TitleIsEmptyException extends HttpException {
  constructor() {
    super(400, 4, `Title cannot be empty string`);
  };
}

export default TitleIsEmptyException;