import { StatusCodes } from "http-status-codes";

// カスタムErrorクラスを規定している。
// throw new NotFoundError(エラーメッセージ)のように使用する。

export class NotFoundError extends Error{
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
    // 400エラーを返す。
  }
}

export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthenticatedError'
    this.statusCode = StatusCodes.UNAUTHORIZED
    // 401エラーを返す。
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.statusCode = StatusCodes.FORBIDDEN
  }
}