import HttpException from './HttpException';

class CoomentNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, 7, `commentId ${id} Not found`);
  };
}

export default CoomentNotFoundException;