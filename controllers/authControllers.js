import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0
  req.body.role = isFirstAccount ? 'admin' : 'user'

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  req.body.password = hashedPassword

  const user = await User.create(req.body);
  // req.body内のpasswordは上記で上書き後のもの。
  res.status(StatusCodes.CREATED).json({msg: 'user was created'});
  // registerの際には登録情報をres.jsonする必要は一般的には無い。もし返す場合には、passwordを含めないよう気を付ける。
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.find({ email, password });
  res.status(StatusCodes.OK).json(user);
};
