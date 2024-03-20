import { Router } from 'express';

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from '../controllers/userController.js';
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import { authorizePermissions } from '../middleware/authMiddleware.js';
import upload from '../middleware/multerMiddleware.js';

const router = Router();
router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats', [
  authorizePermissions('admin'),
  // 権限を持つroleを限定する。ここではadminのroleを持つユーザーのみがnextされるようにしている。
  getApplicationStats,
]);
// []で囲むかは好みで、付けなくてもOK。ここではミドルとコントローラーの関係が見やすいように[]で囲っている。
router.patch('/update-user', upload.single('avatar'), validateUpdateUserInput, updateUser);
// このリクエストはJSONではなくformDataが multipart/form-dataでエンコードされて送られてくる。
// multerは、destinationに指定されたpathに、filenameに指定された名前でfileを格納する。
// ここではmulterが処理するfileは一つだからupload.single。引数はfileのinput要素に付けたname。
// controllerの前にmulterを通すことで、'avatar'の名前のついたfileにreq.fileでアクセスできるようになる。

export default router;
