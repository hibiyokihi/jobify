import { Router } from 'express';
const router = Router();

import { register, login } from '../controllers/authControllers.js';

import {
  validateRegisterInput,
  validateLoginInput,
} from '../middleware/validationMiddleware.js';

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);
// 一つのエンドポイントに複数のメソッドがある場合は、router.route('/').get(**).post(**)のように書く方法もある。
// validateLoginInputは、ユーザーが入力したemailとpasswordのフォーマットに問題ないかをチェックする。
// loginは、入力されたemailとpasswordに合致するユーザーがいる場合にtokenを生成し、cookieに載せてフロントに送る。

export default router;
