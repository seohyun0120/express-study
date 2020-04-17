import HttpException from './HttpException';

class FileNotFoundException extends HttpException {
  constructor() {
    super(404, 1, `File Not found`);
  };
}

export default FileNotFoundException;