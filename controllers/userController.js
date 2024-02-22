import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import Job from '../models/JobModel.js';

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  // findById()でもOk。
  // user情報はフロント側でcookieやlocalStorageに保存せずに、cookieに保存してるのはtokenだけ。その方が安全。
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'application stats' });
};

export const updateUser = async (req, res) => {
  const obj = { ...req.body };
  delete obj.password;
  // フロントのUpdateフォームにpassword欄を設けなければreq.bodyにpasswordは無いのでは？
  const updateUser = await User.findByIdAndUpdate(req.user.userId, obj, {
    new: true,
  });
  res.status(StatusCodes.OK).json({ updateUser });
};
