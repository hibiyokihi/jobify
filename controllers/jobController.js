import Job from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';
// status(400)等、statusCodeを覚えるのは大変だから、代わりに分かりやすい言葉で置き換えてくれるライブラリ。
import mongoose from 'mongoose';
import day from 'dayjs';

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  // 先にauthenticateUserミドルが呼ばれてるから、verifyJWT後でreq.userが付いた状態で呼び出される。
  // ミドルとコントローラー間は一つのrequestとして扱われるが、一連が終わればreqは終了し、ユーザー情報もreqと共に消える。
  res.status(StatusCodes.OK).json({ jobs });
};

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  // JobモデルのcreatedByフィールドは、フォーム入力ではなくログインユーザー情報から自動的に取ってくるようにする。
  const job = await Job.create(req.body);
  // スキーマと入力内容を元にモデルインスタンスが作成される。IDはMongoDBが自動作成する。
  res.status(StatusCodes.CREATED).json({ job });
  // asyncの中のエラーに対処するには、try-catchをするか、express-async-errorsミドルウェアを使うか。
  // 全てにtry-catchを書くのは煩雑だから、今回はミドルウェアを使っている。
};

export const getJob = async (req, res) => {
  const { id } = req.params;
  // req.paramsで'/api/v1/jobs/:id'のidを取り出せる。
  const job = await Job.findById(id);
  // findById(req.params.id)としてもOK
  res.status(StatusCodes.OK).json({ job });
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // 第2引数にreq.body全体を渡してあげれば、ES6は変更箇所を探してupdateしてくれる。
  // 第3引数のオプションにnewを設定すると、更新後のインスタンスを返してくれる（デフォルトは更新前のものを返す）
  res.status(StatusCodes.OK).json({ msg: 'job modified', job: updatedJob });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await Job.findByIdAndRemove(id);
  res
    .status(StatusCodes.OK)
    .json({ msg: `successfully deleted id ${id}`, job: removedJob });
  // 一般的には、deleteした時はmsgを返すだけで十分。deleteしたものをフロント側で使うならjobを返す。
};

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    // mongoDBにもpandas的な機能があり、aggregation-pipelineと呼ばれる。詳細はREADMEファイル5273行以降を参照。
    // aggregation-pipelineは、db.collection.aggregate()メソッドで使用する。つまりモデル名.aggregate()
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    // 1つ目はmatch-stage(フィルター機能)。Jobインスタンスの中でログインユーザーのIDにマッチするものをフィルターする。
    // req.user.userIdはstringだから、ObjectId形式に変換する
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
    // 2つ目はgroupby-stage。_idにはグルーピングに使うフィールド、countには計算方法を指定する。
    // aggregateはArrayを返し、中身はここで指定した {_id: xxx, count: yyy} がグループの数だけ含まれる。
    // xxxにはグルーピング項目である各jobStatusが、yyyにはそのjobStatusでグルーピングしてsumした結果が入る。
  ]);

  stats = stats.reduce((acc, curr) => {
    // aggregate()はグルーピング結果をArrayに入れて返すが、stats.pendingのように使いたいからオブジェクトに入れ直す。
    const { _id: title, count } = curr;
    // statsは、{_id: グルーピング項目, count: 合計数} のArrayだから、currにはこのオブジェクトが入る。
    // _idはaggregate規定のキーで、ここではtitleに変更してdestructureする。
    acc[title] = count;
    // accの初期値は{}として、ここに各titleとcountをkey-valueにして入れていく。
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
    // 該当項目が無い場合にはゼロを表示したいから、statsをそのまま返さずに上記のようにする。
  };
  let monthlyApplications = [
    {
      date: 'May 23',
      count: 12,
    },
    {
      date: 'Jun 23',
      count: 10,
    },
    {
      date: 'Jul 23',
      count: 3,
    },
  ];
  // res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
