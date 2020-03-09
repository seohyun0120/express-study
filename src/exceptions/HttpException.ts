class HttpException extends Error {
  status: number;
  code: number;
  message: string;

  constructor(status: number, code: number, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
  };
};

export default HttpException;
