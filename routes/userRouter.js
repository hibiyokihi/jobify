import { Router } from 'express';

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from '../controllers/userController.js';
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import {
  authorizePermissions,
  checkForTestUser,
} from '../middleware/authMiddleware.js';
import upload from '../middleware/multerMiddleware.js';

const router = Router();
router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats', [
  authorizePermissions('admin'),
  // 権限を持つroleを限定する。ここではadminのroleを持たないユーザーからのリクエストをエラーにする。
  // adminしかアクセス権限がないから、checkForTestUserは不要。
  getApplicationStats,
]);
// []で囲むかは好みで、付けなくてもOK。ここではミドルとコントローラーの関係が見やすいように[]で囲っている。
router.patch(
  '/update-user',
  checkForTestUser,
  // テストユーザーはupdateUserできないように、checkForTestUserミドルを置く。
  upload.single('avatar'),
  // multerの機能で、指定した画像ファイルをbufferデータにしてメモリ上に一時保管する。
  // multerはreq.fileプロパティを作り、上記のメモリデータを参照する。
  validateUpdateUserInput,
  // このリクエストはJSONではなくformDataが multipart/form-dataでエンコードされて送られてくる。
  updateUser
);

// 下記はmulterのdiskStorageを使った場合の説明。今回はmemoryStorageを使うが、一応メモとして残す。
  // multerは、destinationに指定されたpathに、filenameに指定された名前でfileを格納する。
  // ここではmulterが処理するfileは一つだからupload.single。引数はfileのinput要素に付けたname。
  // controllerの前にmulterを通すことで、'avatar'の名前のついたfileにreq.fileでアクセスできるようになる。

export default router;
