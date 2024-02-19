import { body, validationResult } from 'express-validator';
// joiと同じく、validationを行うパッケージ。request.bodyを見に行くからbodyを取り出してる。
import { BadRequestError } from '../errors/customErrors.js';

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
  
])

// export const validateTest = withValidationErrors([
//   body('name')
//     .notEmpty()
//     .withMessage('name is required')
//     .isLength({ min: 3, max: 100 })
//     .withMessage('name must be between 3 and 100 characters')
//     .trim(),
//   // req.bodyから'name'を探して、notEmptyがfalseなら(emptyであるなら)、エラーメッセージを流す。
//   // validationは必要な数だけチェーンできる。
// ]);
