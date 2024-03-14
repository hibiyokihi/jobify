import jwt from 'jsonwebtoken';

export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // user情報をダイレクトにcookieに入れるのは危険。cookieにはtokenを保存し、tokenの中にユーザー情報が含まれるようにする。
  // loginから引き渡されたpayload(userId, roll)が、後にverifyJWT(token)がリターンする値となる。

  return token;
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  // 引数に渡されたtokenが、createJWTで作成されたものと一致することを確認し、生成時にpayloadに指定した項目を返す。
  // logoutするとtokenの値が'logout'になるよう規定したが、この場合は何がリターンされるか？？
  return decoded
}