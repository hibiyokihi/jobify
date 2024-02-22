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
  // adminユーザーにのみ、このRouteへのアクセスを許可する。
  getApplicationStats,
]);
// []で囲むのは見た目の問題で実行上の影響はない。
router.patch('/update-user', validateUpdateUserInput, updateUser);

export default router;
