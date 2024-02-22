import 'express-async-errors';
// asyncの中で生じたエラーをerrorミドルウェアにforwardするミドルウェア。一番最初にインポートすること。
// errorミドルウェアは、単体ではasync内のエラーはキャッチできない。try-catchするか、このミドルを使うか。
import * as dotenv from 'dotenv';
dotenv.config();
// この設定をトップに置かないとエラーが生じることがある。
import express from 'express';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
// cookieにアクセスするためのミドルウェア

import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // コンソールにrequestの結果をログ表示するミドルウェア。リクエストエラーの原因把握に有用。引数には所定のオプションを指定。
  // production環境ではログ表示は不要だから、開発環境でのみmorganが動くようにする。
}

app.use(cookieParser());

app.use(express.json());
// サーバーからjsonを返すためのミドルがexpress.json()

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.use('/api/v1/jobs', authenticateUser, jobRouter);

// 第一引数がjobRouterのprefix。
// /api/v1/jobs/ にget,postがあった場合の対応、/api/v1/jobs/:idにget,patch,deleteがあった場合の対応をJobRouterが規定。
// authenticateUserは、tokenによるログイン状態をチェックするミドルウェア。
// jobRouterの前に挟むことで、/jobsに対する全てのリクエストについて事前にログインチェックを行うことができる。
// authenticateUserは、req.cookiesにtokenがある場合には、loginコントローラーが作成したtokenと照合する。
// 照合が取れたら、loginがtokenをcreateした際に指定したpayload項目をreq.userにくっつけてjobRouterにnextする。
// jobRouter内では、req.user(このケースではuserId, role)を使うことができる。

app.use('/api/v1/auth', authRouter);
// authRouterの先、registerとloginそれぞれに対して入力内容のvalidationミドルを挟む。
// loginは、入力されたemailとpasswordに合致するユーザーがいたら、tokenをcreateして、それをcookieに入れてフロントに送る。
// フロントはそのcookieを一定期間保存して、request時にはreq.cookiesを含めてAPIにリクエストする。

app.use('/api/v1/users', authenticateUser, userRouter);

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
  // ＊(not foundミドルウェア)：上記のどのエンドポイント(リクエストメソッド)にも該当しない場合に発動する。よって最後に書く。
  // 但し、/api/v1/jobs/の後に何かしらの文字が入っているケースでは、:idとみなされて"idが見つからない"のエラーが生じる。
});

app.use(errorHandlerMiddleware);
// errorのミドルウェアは、エンドポイントは存在するものの、何か他の理由でエラーが生じた場合に発動する。
// コード内でthrow new Error(***)と書くと、このErrorミドルウェアが発動する。try-cqtchも同じ？？
// *(not found)ミドルウェアよりも後で、一番最後に書くこと。

const port = process.env.PORT || 5100;
try {
  await mongoose.connect(process.env.MONGO_URL);
  // 新機能により、asyncFnを書かなくてもawaitだけで使えるようになった。
  app.listen(port, () => {
    console.log(`server is running on PORT ${port}`);
  });
  // Expressのサーバーが、MongoDBと繋がった後にport5100を開いてClientからのリクエストを待つ。
} catch (error) {
  console.log(error);
  process.exit(1);
  // DBへの接続でエラーが生じた場合はapp.listenされずにエラー表示して強制終了する。
  // 1は、強制終了するためのコード。何か処理待ちの作業が残っていても終了する。
}
