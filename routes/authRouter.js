import { Router } from 'express';
const router = Router();

import { register, login } from '../controllers/authControllers.js';

import { validateRegisterInput } from '../middleware/validationMiddleware.js';

router.post('/register', validateRegisterInput, register);
router.post('/login', login);
// 一つのエンドポイントに複数のメソッドがある場合は、router.route('/').get(**).post(**)のように書く方法もある。
// ここでは一つだけだから、原則的な書き方をしてる。

export default router;
