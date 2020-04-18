import HttpException from './HttpException';

class FileNotFoundException extends HttpException {
  constructor(filename: string) {
    super(404, 1, `File ${filename} Not found`);
  };
}

export default FileNotFoundException;