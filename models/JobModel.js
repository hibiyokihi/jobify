import mongoose from 'mongoose';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';

const JobSchema = new mongoose.Schema(
  {
    // _id: String,
    company: String,
    position: String,
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS),
      // 選択肢から選ぶ場合にenumを使う。
      // arrayで書いてもいいが、ここでは使い回しできる形にしている。引数に渡したobjectのvalueでarrayを作るメソッド。
      default: JOB_STATUS.PENDING,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      default: 'my city',
    },
  },
  { timestamps: true }
  // 第2引数のtimestampsをtrueにすると、createdAtとupdatedAtフィールドが作成される。
  // Schemaにvalidationを設定することもできるが、今回はExpress Validatorを使う。(Joiという選択肢もある)
);

export default mongoose.model('Job', JobSchema);
// MongoDBにモデルを作成するメソッド。第1引数にモデル名を渡すと、複数形でコレクションが作られる。
// このケースでは、jobsというコレクションがMongoDBに作成される。
// defaultエクスポートしてるから、インポートする際の名称は任意。
