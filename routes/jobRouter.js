import { Router } from 'express';
const router = Router();

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from '../controllers/jobController.js';

import {
  validateIdParam,
  // '/api/v1/jobs/:id'で渡されたidが、MongoDBが作成したIDとして正しい形式かvalidateするミドル。
  validateJobInput,
  // post, patchリクエスト時の入力内容をvalidateするミドル
} from '../middleware/validationMiddleware.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';

router
  .route('/')
  .get(getAllJobs)
  .post(checkForTestUser, validateJobInput, createJob);
// /api/v1/jobs/ に対してget, postがあったらそれぞれのコントローラー関数が対応する。
// server.jsがjobRouterを呼ぶ時にauthenticateUserミドルが入ってるから、ログイン後の状態で呼ばれる。
// chedkForTestUserミドルは、テストユーザーの場合にcreateJobに入れないようにする。(getAllJobsはテストユーザーでもOk)
// validateJobInputミドルは、フォーム入力内容のvalidationを行う。
// router.get('/', getAllJobs)の方法で一つずつ書いても良いか、この方が書く量が少なくて済む。

router.route('/stats').get(showStats)
// route('/:id')よりも前に置くこと。下に置くと、statsというidと見做されて届かない。

router
  .route('/:id')
  // 同route内のミドル及びコントローラーにおいて、req.paramsで上記のidを呼び出せる。名称は任意。
  .get(validateIdParam, getJob)
  // idの型エラーがあればBadRequestErrorを発出し、idに該当するjobがなければNotFoundErrorを発出する。
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForTestUser, validateIdParam, deleteJob);
  // updateJobとdeleteJobについては、テストユーザーは行えないようにcheckForTestUserミドルを置く。

export default router;
