import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  // MongoDBでは、CollectionとDocumentでデータが構成されている。countDocumentsはUserの数を数える。
  // Userの数がゼロということは、一人目の登録者であるということ。今回は、一人目の登録者のrollをadminとする。
  req.body.role = isFirstAccount ? 'admin' : 'user';
  req.body.password = await hashPassword(req.body.password);
  // bcryptを使った自作の関数。入力されたパスワードを受けてハッシュしたものを返す。
  // asyncFnだが、使用前にawaitする必要があるのか？？

  const user = await User.create(req.body);
  // req.body内のpasswordは上記でハッシュ後のもの。
  res.status(StatusCodes.CREATED).json({ msg: 'user was created' });
  // registerの際には登録情報をres.jsonする必要は一般的には無い。もし返す場合には、passwordを含めないよう気を付ける。
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('invalid credentials');
  const isPasswordCorrect = await comparePassword(password, user.password);
  // bcryptを使った自作の関数。ハッシュ前と後のパスワードを受けて一致を確認する。
  if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials');
  // 以下のように書くこともできる。user=trueならpasswordの一致をチェックする。
  // const isValidUser = user && (await comparePassword(password, user.password))
  // if (!isValidUser) throw new UnauthenticatedError('invalid credentials');

  const token = createJWT({ userId: user._id, role: user.role });
  // ここで指定したpayload項目が、後にverifyJWT(token)がリターンする値となる。
  // user.roleには、registerの際にadmin又はuserが設定されている。_idはモデルをcreate()した際にMongoDBが作成。
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    // 生成したtokenを直接フロントに送るのではなく、cookieに入れて送る。
    // フロントは受け取ったcookieを指定期間保存し、リクエスト時にはreq.cookiesにtokenが含まれる。
    httpOnly: true,
    // JavaScriptを使ってアクセスされると悪用されるリスクがあるため、HTTPからのアクセスのみを認める。
    expires: new Date(Date.now() + oneDay),
    // JWTのexpiredInとは異なり、cookieのexpiresは期日を指定する。Date.now()に足すにはミリ秒単位にする必要がある。
    secure: process.env.NODE_ENV === 'production',
    // trueにすると、httpではなくhttpsの場合のみ、このクッキーを送ることができる。
    // 開発中のlocalhostはhttpだからfalseにしておく必要がある。NODE_ENVはproductionフェーズに入ると自動的にtrueに切り替わる。
  });
  // サーバーからtokenを送ってフロントでlocalStorageに保存するやり方もあるが、localはJSを使ってアクセスできるからリスク有る。

  res.status(StatusCodes.OK).json({ msg: 'user logged in' });
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  // フロントのcookiesに保存された’token'を上書きするcookieを送る。上書きして即expireするから、上書きするものは何でも良い。(ここでは'logout')
  res.status(StatusCodes.OK).json({msg: 'user logged out'})
}