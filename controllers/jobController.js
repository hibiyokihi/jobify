import Job from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';
// status(400)等、statusCodeを覚えるのは大変だから、代わりに分かりやすい言葉で置き換えてくれるライブラリ。
import mongoose from 'mongoose';
import day from 'dayjs';

export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;
  console.log(req.query);
  // urlに続けてクエリが入ってリクエストされた場合(/jobs?search=xxx)、サーバー側ではreq.query.searchでxxxにアクセスできる。
  const queryObject = {
    createdBy: req.user.userId,
    // findメソッドで複数条件をつける場合、$andと$orオペレーターが使われるが、条件を並べて書いた場合には$andと同じ扱いになる。
    // 仮に、position: req.query.searchをオブジェクトに追加した場合、両方の条件がマッチしたものをfindはリターンする。
  };
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
    // クエリにsearchが無かった場合は、createdByだけでfindを実行する。
    // createdByがマッチした上で、search入力内容がposition又はcompanyにマッチするものをfindが返す。A and (B or C)
    // queryObjectに、$or: [{position: ...}, {company: ...}] が追加される。
    // $orはmongoDBのオペレーターで、Array要素のいずれかがtrueならtrueを返す。
    // $regexは、$optionsと合わせて使う。options:i は、大文字小文字の区別をしない(Case-Insensibile)。
    // $regexについて勉強が必要。上記の場合、例えばsearchの入力内容がaの場合、aを含む全てがマッチする。(これで良いかは要検討)
  }
  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }
  // allが選択された場合は、queryObjectには追加しない。つまりfindする際のフィルター項目としてjobStatusは省く。
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  };
  // utils.constants.jsにて、これらの値を定数に定めている。

  const sortKey = sortOptions[sort] || sortOptions.newest;
  // sortOptions.sortとしてしまうと、オブジェクトの中からsortキーを探してしまうから、変数を使う場合は[]を使う。

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  // pageとlimitはstringではなくNumber形式にする必要があるから、上段のdestructureとは別に行なっている。
  // limitは、1ページに表示する数を指定する。このプロジェクトではデフォルトの10を使うが、フロント側でアレンジすることも可能。
  const skip = (page - 1) * limit;
  // 例えば2ページ目の場合、skipは10になる。つまり最初の10個をスキップして11個目からlimitの10個を表示する。

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  // 先にauthenticateUserミドルが呼ばれてるから、verifyJWT後でreq.user(.userId)が付いた状態で呼び出される。
  // ミドルとコントローラー間は一つのrequestとして扱われるが、一連が終わればreqは終了し、req.user情報もreqと共に消える。
  // mongoDBのfindメソッドはfindAllのこと。条件にマッチするものは全て取得される。
  // sortは、フィールド名をstringで入れて、descendingの場合はマイナスを頭につける。
  // limitはfindで取得するインスタンスの数を制限する。
  // skip(1)とした場合。、1つ目のインスタンスをスキップして2つ目から取得する。

  const totalJobs = await Job.countDocuments(queryObject);
  // findだけでなく、オブジェクト数を数えるcountDocumentsでもフィルターを引数に入れられる。
  // jobsはlimitで指定した数のjobが含まれるのに対し、totalJobsはlimitに関係なく合計数のままであることに留意。

  const numOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
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

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        // _id: $createdAtとしてしまうと、日付ごとにグルーピングされてしまう。ここでは年と月単位でグルーピングしたい。
        // $yearはdateからyearを取ってきてグルーピングする。yearは任意の変数名。
        // 同様にmonthの条件も付ければ、年と月でグルーピングされる。
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    // .yearの部分は、group-stageで_idに設定した変数名に合わせる。-1はdescending-order。
    // フロントの表示はAscendingにしたいが、直近の６ヶ月を取得したいから、一旦Descendingにする必要がある。
    { $limit: 6 },
    // リターンする結果の上限数を設定する。
  ]);

  monthlyApplications = monthlyApplications
    // フロント側でrechartsライブラリを使ってチャートを表示するため、サーバー側でrechartsのdata形式に整えておく必要がある。
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      // _idをdestructureして、_idからyear, monthをdestructureしても良い。このように１行でも書ける。
      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');
      // day.jsは月はゼロから始まるから１をひく。NodeJSでは１から始まる。
      return { date, count };
    })
    .reverse();
  // 上記で直近６ヶ月を取得するためにDescendingにしたから、ここでAscendingに戻す。

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
