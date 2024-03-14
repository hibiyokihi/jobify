import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import Job from '../models/JobModel.js';

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  // 先にauthenticateUserミドルが呼ばれてるから、verifyJWT後でreq.userが付いた状態で呼び出される。
  // ミドルとコントローラー間は一つのrequestとして扱われるが、一連が終わればreqは終了し、ユーザー情報もreqと共に消える。
  // findById()でOk。findOneを使う場合は、idにはアンダーバーをつけることに留意。
  const userWithoutPassword = user.toJSON();
  // toJSONは、UserSchemaにおいてpasswordを除くように上書きしている。
  res.status(StatusCodes.OK).json({ userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments()
  // mongodbにおいて、テーブルはcollection、レコードはdocument。
  // モデル(collection)のレコード(document)の数を数えるメソッドがcountDocument()。
  const jobs = await Job.countDocuments()
  res.status(StatusCodes.OK).json({ users, jobs });
  // usersとjobsの数を返している。
};

export const updateUser = async (req, res) => {
  const obj = { ...req.body };
  delete obj.password;
  // パスワードはハッシュ処理する必要があるため、他のユーザー情報と同じようにupdateすることはできない。
  // ユーザー登録(register)時と同様にbcryptでハッシュ処理すれば良いが、パスワード変更は別で行われるのが一般的。
  const updateUser = await User.findByIdAndUpdate(req.user.userId, obj, {
    new: true,
    // req.bodyからpasswordを除いてupdateしている。
    // このメソッドは、objで指定した変更箇所を探してupdateしてくれるから、passwordがブランクで上書きされることはない。
    // findOneの時は toJSON してからres.jsonしたが、findByIdAndUpdateとはリターンされる形式が違うのか？
  });
  res.status(StatusCodes.OK).json({ updateUser });

};
