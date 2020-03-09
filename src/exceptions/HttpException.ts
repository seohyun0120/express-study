class HttpException extends Error {
  status: number;
  isSucceeded: boolean;
  code: number;
  message: string;

  constructor(status: number, isSucceded: boolean, code: number, message: string) {
    super(message);
    this.status = status;
    this.isSucceeded = isSucceded;
    this.code = code;
    this.message = message;
  };
};

export default HttpException;
