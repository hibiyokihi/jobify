import { body, param, validationResult } from 'express-validator';
// joiと同じく、validationを行うパッケージ。request.bodyを見に行くからbodyを取り出してる。
import { BadRequestError } from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';

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
  // req.bodyから'company'を探して、notEmptyがfalseなら(emptyであるなら)、errors.arrayにエラー情報を入れる。
  // validationは必要な数だけチェーンできる。
  body('position').notEmpty().withMessage('position is required'),
  body('jobLocation').notEmpty().withMessage('job location is required'),
  body('jobStatus')
    .isIn(Object.values(JOB_STATUS))
    .withMessage('invalid status value'),
  // enum(選択肢から選ぶ)をvalidateする時はisInを使う。JOB_STATUSに規定した選択肢から選ぶのだからisInのはず。
  body('jobType')
    .isIn(Object.values(JOB_TYPE))
    .withMessage('invalid type value'),
]);

export const validateIdParam = withValidationErrors([
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    // 'id'はrouterで設定した/:id。customの引数名は任意で、param上のidの値が渡される。
    // valueが、MongoDBが作成するObjectIdの型と一致するかをvalidateする。idの文字数を増減させるとこのエラーが発生。
    // isValidがfalseの場合、エラー情報がerrors.arrayに渡されて、次のミドルにはnextされず、処理が終了する。
    .withMessage('invalid MongoDB id'),
]);
