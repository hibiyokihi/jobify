import { body, param, validationResult } from 'express-validator';
// joiと同じく、validationを行うパッケージ。request.bodyを見に行くからbodyを取り出してる。
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE, USER_ROLL } from '../utils/constants.js';
import mongoose from 'mongoose';
import Job from '../models/JobModel.js';
import User from '../models/UserModel.js';

const withValidationErrors = (validateValues) => {
  // express-validatorミドルウェアでvalidationする際、このFnを使い回すことができる。引数のvalidationだけ変えればOK。
  // express-validatorは、pathと処理Fnの間にArrayを置き、Arrayの1つ目にvalidation、2つ目にvalidation結果を受けての対応を書く。
  // この関数はvalidationを引数に受けて、express-validatorに必要なArrayを返すためのもの。
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      // バリデーション結果を受けて、エラーがあればerrors.arrayにエラーを入れる。
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith('cannot find')) {
          throw new NotFoundError(errorMessages);
        }
        throw new BadRequestError(errorMessages);
        // errors.arrayがisEmptyでない場合、エラーを表示する。
        // throwエラーされた場合はnext()には進まず、ここで処理が終了する。
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body('company').notEmpty().withMessage('company is required'),
  // req.bodyの'company'がemptyならnotEmptyがfalseになり、errors.arrayにエラー情報を入れてBadRequestErrorが発出される。
  // この場合のBadRequestは、上記withValidationErrorsの第2引数に記載したthrow new BadRequestError。
  // validationは必要な数だけチェーンできる。
  body('position').notEmpty().withMessage('position is required'),
  body('jobLocation').notEmpty().withMessage('job location is required'),
  body('jobStatus')
    .isIn(Object.values(JOB_STATUS))
    .withMessage('invalid status value'),
  // enum(選択肢から選ぶ)をvalidateする時はisInを使う。
  // JOB_STATUSに規定した選択肢以外の値でリクエストがあったら、isInがfalseになりBadRequestErrorが発出される。
  body('jobType')
    .isIn(Object.values(JOB_TYPE))
    .withMessage('invalid type value'),
]);

export const validateIdParam = withValidationErrors([
  param('id').custom(async (value) => {
    // notEmpty()等のオーダーメイドのvalidationもあるが、それ以外はcustomを使ってカスタムvalidationを書く。
    // customでも考えは同じで、custom()がfalseを返したらerrors.arrayにエラー情報が渡される。
    // 'id'はrouterで設定した/:id。customの引数名(value)は任意で、param上のidの値が渡される。
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    // valueが、MongoDBが作成するObjectIdの型と一致しない場合はfalseが入る。idの文字数を増減させるfalseになる。
    if (!isValidId) throw new BadRequestError('invalid MongoDB id');
    // isValidIdがfalseの場合、エラー情報がerrors.arrayに渡される。
    // ここでエラーが完結するのではなく、あくまでエラー発出するのはwithValidationErrorsの第2引数。
    // ここではErrorを使っても同じだが、どのタイプのエラーかが見やすいようにBadRequestErrorを使っている。
    // エラーを渡されたwithValidationErrorsは、errorMessagesのif文でBadRequestErrorかNotFoundErrorかを決めている。
    const job = await Job.findById(value);
    // 上記により、valueにはparamのidの値が入っている。
    if (!job) {
      throw new NotFoundError(`cannot find job id ${value}`);
      // idと対応するjobが無い場合、エラー情報がerrors.arrayに渡される。
      // ここではErrorを使っても同じだが、どのタイプのエラーかが見やすいようにNotFoundErrorを使っている。
    }
  }),
  // custom()の中をsyncnessで書いた例は以下の通り。
  // .custom((value) => mongoose.Types.ObjectId.isValid(value))
  // .withMessage('invalid MongoDB id')
  // IDエラーがあればcutsomはfalseを返し、暗示的にエラーは発出する。
  // validationが一つだけならこの方法で良いが、ここではNotFoundエラーにも対応させたい。よってasyncで書くことにする。
  // asyncで書いた場合、customの中身はbooleanではなくpromissを返すため、暗示的なエラー対応がなされない。
  // よって場合分けをした上で明示的にthrow new Errorでエラーを発出する。
]);

export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required.'),
  body('email')
    .notEmpty()
    .withMessage('email is required.')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('user already exists');
      }
      // 引数にはbodyの'email'のバリューが入る。既にDBに存在するemailなら、登録済みのユーザー。
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required.')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters'),
  body('lastName').notEmpty().withMessage('last name is required'),
  body('location').notEmpty().withMessage('location is required'),
]);

export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required.')
    .isEmail()
    .withMessage('invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('password is required.')
]);
