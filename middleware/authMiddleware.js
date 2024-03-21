import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  // req.cookiesは、cookieParserライブラリをapp.use()することで使えるようになる。（server.jsにて)
  // authControllersのloginに、tokenのクッキー名をtokenに設定したから、req.cookies.tokenで呼び出せる。
  if (!token) throw new UnauthenticatedError('authentication invalid');
  // api/v1/jobsに対してリクエストがあった際に、リクエストの中にcookies.tokenがなければエラーを出す。
  // logoutするとreq.cookies.tokenの内容が'logout'になるように規定してる。この場合、正しくエラーをキャッチできる？

  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === '65fbdd58263a5518a4c791cf';
    // postmanでテストユーザーを作って、そのuserIdをmongoDBから探してコピペした。
    req.user = { userId, role, testUser };
    next();
    // user情報がダイレクトに取り出せるのは危険だから、cookieにはtokenを保存し、tokenの中にユーザー情報が含まれるようにする。
    // jwt.signで作られたtokenは、jwt.verifyでのみ中身のpayloadを取り出せる。
    // 取り出したユーザー情報はフロント側で保管せず、req.userに設定することで、そのreqでのみユーザー情報が扱える。
  } catch (error) {
    throw new UnauthenticatedError(
      'authentication invalid, virification failed'
    );
    // logoutするとtokenが'logout'になるからuserIdとrollが無く、req.userはnullとしてnextされるのか？
    // それともtokenが'logout'だとエラーキャッチされるのか？
  }
};
// このミドルウェアに飛んできたreqにcookies.tokenが有るかを確認する。
// verifyJWTは、受け取ったtokenがサーバーがcreateしたのと同じものであることを確認し、create時のpayload項目を返す。
// req.userにそのpayload項目をセットし、次のcontrollerにreqを引き渡す。
// これにより、next以降ではreq.userを使えるようになる。

export const authorizePermissions =
  (...roles) =>
  // この処理を行う権限を持つroleを引数に受ける。引数が一つでもスプレッドすることでArray形式になり、includeメソッドを適用できる。
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
      // ユーザーのroleが引数で渡された権限者roleに含まれていなければ、Unauthorizedエラーとなる。
    }
    next();
  };

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError('Demo User. Read only...');
  // ログインユーザーのuserIdがテストユーザーのidと一致する場合、testUserがtrueになってる。
  next();
};
