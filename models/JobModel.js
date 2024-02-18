import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    jobStatus: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      // 選択肢から選ぶ場合にenumを使う
      default: 'pending',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      default: 'my city',
    },
  },
  { timestamps: true }
  // 第2引数のtimestampsをtrueにすると、createdAtとupdatedAtフィールドが作成される。
);

export default mongoose.model('Job', JobSchema)
// MongoDBにモデルを作成するメソッド。第1引数にモデル名を渡すと、複数形でコレクションが作られる。
// このケースでは、jobsというコレクションがMongoDBに作成される。