import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  // コードのどこかでthrow new Error(又はカスタムError)が出された時に、このErrorミドルウェアにforwardされてくる。
  // NotFoundError、BadRequestError、UnauthenticatedError等のErrorクラスをcustomErrors.jsで規定した。
  // Errorミドルはエラー情報をerrを受け取り、各Errorクラスのプロパティにerr.statusCodeのようにアクセスできる。
  // 引数の最初にerrを入れることでErrorミドルとして認識される？
  console.log(err);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  // 発出されたErrorクラスのstatudCode、該当するものが無ければINTERNAL_SERVER_ERROR(500)
  const msg = err.message || 'something went wrong, try again.';
  // Error発出時に引数に入れたメッセージは、err.messageで使える。
  res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
