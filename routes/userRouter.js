import { Router } from 'express';
const router = Router();

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from '../controllers/userController.js';
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import { authorizePermissions } from '../middleware/authMiddleware.js';

router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats', [
  authorizePermissions('admin'),
  // 権限を持つroleを限定する。ここではadminのroleを持つユーザーのみがnextされるようにしている。
  getApplicationStats,
]);
// []で囲むかは好みで、付けなくてもOK。ここではミドルとコントローラーの関係が見やすいように[]で囲っている。
router.patch('/update-user', validateUpdateUserInput, updateUser);

export default router;
