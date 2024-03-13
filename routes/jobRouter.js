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
  // '/api/v1/jobs/:id'で渡されたidが、MongoDBが作成したIDとして正しい形式かvalidateするミドル。
  validateJobInput,
  // post, patchリクエスト時の入力内容をvalidateするミドル
} from '../middleware/validationMiddleware.js';

router.route('/').get(getAllJobs).post(validateJobInput, createJob);
// /api/v1/jobs/ に対してget, postがあったらそれぞれのコントローラー関数が対応する。
// jobRouterの呼び出し時にauthenticateUserミドルが入ってるから、ログイン後の状態で呼ばれる。
// postに関しては、入力内容の形式確認をするミドルを入れている。
// router.get('/', getAllJobs)の方法で一つずつ書いても良いか、この方が書く量が少なくて済む。
router
  .route('/:id')
  .get(validateIdParam, getJob)
  // ミドル及びコントローラーにおいて、req.paramsで上記のidを呼び出せる。名称は任意。
  // idの型エラーがあればBadRequestErrorを発出し、idに該当するjobがなければNotFoundErrorを発出する。
  .patch(validateJobInput, validateIdParam, updateJob)
  .delete(validateIdParam, deleteJob);

export default router;
