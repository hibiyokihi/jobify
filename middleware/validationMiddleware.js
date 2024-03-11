import { body, param, validationResult } from 'express-validator';
// joiと同じく、validationを行うパッケージ。request.bodyを見に行きたいからbodyを取り出してる。
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
    // この関数を呼び出す際に渡したexpress-validatorのvalidation。
    (req, res, next) => {
      const errors = validationResult(req);
      // 第一引数のvalidationの結果が入り、エラーがあればerrors.arrayにエラー内容が入る。
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith('cannot find')) {
          throw new NotFoundError(errorMessages);
        }
        throw new BadRequestError(errorMessages);
        // error.arrayに入ったエラー内容に応じて、NotFound又はBadRequeatのエラーを出す。
        // errors.arrayがisEmptyでない場合(throw new Errorされた場合)、next()には進まず、ここで処理が終了する。
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  // express-validatorには予め処理メソッド(notEmpty等)が規定されている。それ以外はcustomメソッドを使う。
  body('company').notEmpty().withMessage('company is required'),
  // req.body.companyがemptyならnotEmptyがfalseになり、errors.arrayにエラーメッセージが入る。
  // withValidationErrorsにおいて、'cannot find'で始まるもの以外はBadRequestErrorが発出される。
  // ここでは一つだが、validationは必要な数だけチェーンできる。
  body('position').notEmpty().withMessage('position is required'),
  body('jobLocation').notEmpty().withMessage('job location is required'),
  body('jobStatus')
    .isIn(Object.values(JOB_STATUS))
    // enum(選択肢から選ぶ)をvalidateする時はisInを使う。
    // JOB_STATUSはオブジェクト形式になっており、Object.valuesでvalueだけがArray形式で取り出される。
    // req.body.jobStatusの値がArrayに含まれていなければfalseとなり、errors.arrayにエラーメッセージが入る。
    .withMessage('invalid status value'),
  body('jobType')
    .isIn(Object.values(JOB_TYPE))
    .withMessage('invalid type value'),
]);

export const validateIdParam = withValidationErrors([
  param('id').custom(async (value) => {
    // express-validatorを使う場合、notEmpty()等の所定の処理以外はcustomを使ってカスタムvalidationを書く。
    // customでも考えは同じで、custom()がfalseを返したらerrors.arrayにエラー情報が入る。
    // param('id')により、route('/:id')で記載したidにアクセスできる。
    // 引数名のvalueは任意名称で、route('/:id')のidの値がvalueに入る。
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    // MongoDBが作成するObjectIdの型としてvalidでない場合はfalseが入る。idの文字数が変わるとfalseになる。
    if (!isValidId) throw new BadRequestError('invalid MongoDB id');
    // idの型エラーの場合、記載したエラーメッセージがerrors.arrayに渡される。
    // ここでエラーが発出されるのではなく、エラーを発出するのはwithValidationErrorsの関数。
    // ここではエラー名称は関係ないが、どのタイプのエラーかが見やすいようにBadRequestErrorを使っている。
    // withValidationErrorsは、error.arrayのエラーメッセージの内容からBadRequestErrorかNotFoundErrorかを判別してる。
    const job = await Job.findById(value);
    // valueにはparam('id')によりidが入っている。
    if (!job) {
      throw new NotFoundError(`cannot find job id ${value}`);
      // idの型は正しいものの該当jobが無い場合、エラーメッセージがerrors.arrayに渡される。
      // ここではエラー名称は関係ないが、どのタイプのエラーかが見やすいようにNotFoundErrorを使っている。
    }
  }),
  // custom()の中をsyncnessで書いた例は以下の通り。
  // .custom((value) => mongoose.Types.ObjectId.isValid(value))
  // .withMessage('invalid MongoDB id')
  // idの型エラーがあればcutsom関数はfalseを返し、error.arrayにエラーメッセージが入る（暗示的）
  // validationが一つだけならこの方法で良いが、ここではNotFoundエラーにも対応させたいからasyncで書いた。
  // asyncで書いた場合、customの中身はbooleanではなくpromissを返すため、暗示的なエラー対応が行われない。
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
      // 引数にはreq.bodyの'email'のバリューが入る。既にDBに存在するemailなら、登録済みのユーザー。
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

export const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required.'),
  body('email')
    .notEmpty()
    .withMessage('email is required.')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, {req}) => {
      const user = await User.findOne({ email });
      // emailがupdate前と同じものであれば、当然にDBには本人のemailが存在するからuserにはログインユーザー本人が入る。
      // updateによりemailを変更する場合には、新しいemailはDBには無いはずだからuserにはundifinedが入るはず。
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError('user already exists');
      }
      // email変更なしのケースでは、userにはログインユーザー本人が入っている。これは正常。
      // よって、userがある場合にはuser._idとログインユーザーのuserIdが一致してれば正常。もし不一致ならエラー。
      // このエラーケースは、他の登録ユーザーのemailに変更しようとした時。emailがDB上にあるが、本人ではないケース。
    }),

  body('lastName').notEmpty().withMessage('last name is required'),
  body('location').notEmpty().withMessage('location is required'),
]);