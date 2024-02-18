import { Router } from 'express';
const router = Router();

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';

router.route('/').get(getAllJobs).post(createJob)
// /api/v1/jobs/ に対してget, postがあったらそれぞれの関数が対応する。
// router.get('/', getAllJobs)の方法で一つずつ書いても良いか、この方が書く量が少なくて済む。
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

export default router