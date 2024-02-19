import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  // throw new Error(又はカスタムError)が呼ばれた時に、Errorミドルウェアにforwardされてくる。
  // Errorミドルはエラー情報をerrを受け取り、err.statusCodeでErrorクラスのステータスコードが入手される。
  console.log(err);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  // NotFoundErrorクラスの場合は、StatusCodes.NOT_FOUND(404)が代入される。customErrors.js参照。
  // 通常のErrorクラスの場合は、StatusCodes.INTERNAL_SERVER_ERROR(500)が代入される。
  const msg = err.message || 'something went wrong, try again.';
  // Error()やNotFoundError()の引数に書いたエラーメッセージが、err.messageで入手される。
  res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
