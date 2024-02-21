// import { StatusCodes } from 'http-status-codes';
// import User from '../models/UserModel.js';

// export const getAllUsers = async (req, res) => {
//   const users = await User.find({});
//   res.status(StatusCodes.OK).json(users);
// };

// export const createUser = async (req, res) => {
//   const user = await User.create(req.body);
//   res.status(StatusCodes.CREATED).json(user);
// };

// export const getUser = async (req, res) => {
//   const { id } = req.params;
//   const user = await User.findById(id);
//   res.status(StatusCodes.OK).json(user);
// };

// export const updateUser = async (req, res) => {
//   const { id } = req.params;
//   const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
//   res
//     .status(StatusCodes.OK)
//     .json({ msg: 'successfully updated', job: updatedUser });
// };

// export const deleteUser = async (req, res) => {
//   const { id } = req.params;
//   const deletedUser = await User.findByIdAndDelete(id);
//   res
//     .status(StatusCodes.OK)
//     .json({ msg: 'successfully deleted', job: deletedUser });
// };
