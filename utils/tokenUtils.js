import jwt from 'jsonwebtoken';

export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // 引数に渡されたpayload項目が、後にverifyJWT(token)がリターンする値となる。

  return token;
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  // 引数に渡されたtokenが、createJWTで作成されたものと一致することを確認し、生成時にpayloadに指定した項目を返す。
  return decoded
}