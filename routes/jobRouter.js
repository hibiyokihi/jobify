import { Router } from 'express';
const router = Router();

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import {
  validateIdParam,
  // paramとして渡した':id'が、MongoDBが作成したIDとして正しい形式かvalidateするミドル。
  validateJobInput,
  // post, patchリクエスト時の入力内容をvalidateするミドル
} from '../middleware/validationMiddleware.js';

router.route('/').get(getAllJobs).post(validateJobInput, createJob);
// /api/v1/jobs/ に対してget, postがあったらそれぞれの関数が対応する。
// ミドルウェアがある場合は、処理関数の前に書く。ここではpostデータをvalidationするミドルウェアが入る。
// router.get('/', getAllJobs)の方法で一つずつ書いても良いか、この方が書く量が少なくて済む。
router
  .route('/:id')
  .get(validateIdParam, getJob)
  .patch(validateJobInput, validateIdParam, updateJob)
  .delete(validateIdParam, deleteJob);

export default router;
