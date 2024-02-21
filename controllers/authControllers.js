import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';
  req.body.password = await hashPassword(req.body.password);

  // const salt = await bcrypt.genSalt(10)
  // const hashedPassword = await bcrypt.hash(req.body.password, salt)
  // req.body.password = hashedPassword

  const user = await User.create(req.body);
  // req.body内のpasswordは上記で上書き後のもの。
  res.status(StatusCodes.CREATED).json({ msg: 'user was created' });
  // registerの際には登録情報をres.jsonする必要は一般的には無い。もし返す場合には、passwordを含めないよう気を付ける。
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('invalid credentials');
  const isPasswordCorrect = await comparePassword(password, user.password);
  // 基本的に、asyncFnを使う時はawaitするということだろう。
  if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials');
  // const isValidUser = user && (await comparePassword(password, user.password))
  // 上記のように書くこともできる。user=falseならその時点でfalse、user=trueならpasswordをチェックする。

  const token = createJWT({ userId: user._id, role: user.role });
  // ここで指定したpayload項目が、後にverifyJWT(token)がリターンする値となる。_idはMongoDBが自動作成するid。
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
    // 開発中のlocalhostはhttpだからfalseである必要があり、productionフェーズに入るとtrueに切り替わるようにする。
  });
  // サーバーからtokenを送ってフロントでlocalStorageに保存するやり方もあるが、localはJSを使ってアクセスできるからリスク有る。

  res.status(StatusCodes.OK).json({ msg: 'user logged in' });
};
