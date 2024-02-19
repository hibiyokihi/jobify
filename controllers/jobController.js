import Job from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';
// status(400)等、statusCodeを覚えるのは大変だから、代わりに分かりやすい言葉で置き換えてくれるライブラリ。
import { NotFoundError } from '../errors/customErrors.js';

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({});
  // モデルの全てのインスタンスを取り出す場合。
  res.status(StatusCodes.OK).json(jobs);
};

export const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  // スキーマと入力内容を元にモデルインスタンスが作成される。IDはMongoDBが自動作成する。
  res.status(StatusCodes.CREATED).json({ job });
  // asyncの中のエラーに対処するには、try-catchをするか、express-async-errorsミドルウェアを使うか。
  // 全てにtry-catchを書くのは煩雑だから、今回はミドルウェアを使っている。
};

export const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    throw new NotFoundError(`cannot find job id ${id}`);
    // エラー情報がErrorミドルウェアにerrとして渡される。
    // このカスタムError作成時にthis.statusCode = StatusCodes.NOT_FOUNDとしてるから、404が出される。
    // でも、現時点においてこのコードはうまく動かない。Errorミドルウェアが発動して500エラーが出る。先々進めてからまた戻ってこよう。
  }
  res.status(StatusCodes.OK).json(job);
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // 第2引数には、body全体を渡してあげればESが必要な部分を拾って対応してくれる。
  // 第3引数のオプションにnewを設定すると、更新後のインスタンスを返してくれる（デフォルトは更新前のものを返す）
  if (!updatedJob) {
    throw new NotFoundError(`cannot find job id ${id}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'job modified', updatedJob });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await Job.findByIdAndRemove(id);
  if (!removedJob) {
    throw new NotFoundError(`cannot find job id ${id}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `successfully deleted id ${id}`, job: removedJob });
  // 一般的には、deleteした時はmsgを返すだけで十分。deleteしたものをフロント側で使うならjobを返す。
};
