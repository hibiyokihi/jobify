import { readFile } from 'fs/promises';
// fsモジュールに関して、call-backではなくpromises方式を選択。よってreadFileはpromiseを返す。
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Job from './models/JobModel.js';
import User from './models/UserModel.js';

// このヘルパーモジュールは、Userにモックデータを付け加えるためにターミナルから'node populate'として実行するもの。
// User.findOneのemailを書き換えることで、任意のユーザーに対してモックデータを付け加えることができる。
// アプリ内で使われるものではないことに留意。

try {
  await mongoose.connect(process.env.MONGO_URL);
  const user = await User.findOne({ email: 'suzu@example.com' });
  // テストユーザーを取得する。
  const jsonJobs = JSON.parse(
    await readFile(new URL('./utils/mockData.json', import.meta.url))
  );
  // ES6を使う場合、import.meta.urlによってモジュールのurlが取得される。ここではトップレベルのurlを取得。
  // URLは、第2引数のbaseUrlと、第1引数のpathを繋げてurlを作成する。
  // readFileはpromiseを返し、URLがresolveしたらファイルの中身(JSON)を文字列で返す。
  // parseは、引数の文字列をJSONに変換する。よってjsonJobsにはモックデータがjson形式で入る。
  const jobs = jsonJobs.map((job) => {
    return { ...job, createdBy: user._id };
    // mockarooでモックデータを作る際に、ユーザーはランダムで作ることはできないから、createdByは後付けする。
  });
  await Job.deleteMany({ createdBy: user._id });
  // クリーンな状態からスタートしたいから、テストユーザーで作られた既存データは一旦削除する。
  await Job.create(jobs);
  console.log('Success!');
  process.exit(0);
  // ターミナルで実行した際に、モジュールが終了しないと次の操作ができないから、成功しても失敗してもモジュールを終了させる。
} catch (error) {
  console.log(error);
  process.exit(1);
}
