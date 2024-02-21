import { UnauthenticatedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  // cookiesは、cookieParserライブラリをapp.use()することで使えるようになる。
  // authControllersのloginに、tokenのクッキー名をtokenに設定したから、req.cookies.tokenで呼び出せる。
  if (!token) throw new UnauthenticatedError('authentication invalid');
  // api/v1/jobsに対してリクエストがあった際に、リクエストの中にcookies.tokenがなければエラーを出す。

  try {
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid, virification failed');
  }
};
// このミドルウェアに飛んできたreqにcookies.tokenが有るかを確認する。
// verifyJWTは、受け取ったtokenがサーバーがcreateしたのと同じものであることを確認し、create時のpayload項目を返す。
// req.userにそのpayload項目をセットし、次のcontrollerにreqを引き渡す。
// これにより、next以降ではreq.userを使えるようになる。
