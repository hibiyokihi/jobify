import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Error{
  // Errorクラスは、"throw new Error()"の時に使うあれ。NotFound用にカスタマイズしてる。
  constructor(message) {
    // インスタンスが作られる際には、引数に入れたエラーメッセージがmessageで渡される。
    super(message)
    // Errorクラスのconstructorにmessageが渡されて実行される。
    this.name = 'NotFoundError'
    // このプロジェクトでは使わない。参考に書いただけ。
    this.statusCode = StatusCodes.NOT_FOUND
    // このカスタムErrorが呼ばれた時はstatus-codeは404になる。Errorクラスだと500が出てしまう。
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadRequestError'
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthenticatedError'
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.statusCode = StatusCodes.FORBIDDEN
  }
}