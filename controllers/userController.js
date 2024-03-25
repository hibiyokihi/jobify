import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import Job from '../models/JobModel.js';
import cloudinary from 'cloudinary';
import { formatImage } from '../middleware/multerMiddleware.js';

// import { promises as fs } from 'fs';
// fsモジュールにはsync方式とasync方式のAPIが含まれ、async方式のAPIはfs/promisesという別モジュール名でも参照できる。
// fs/promises.unlinkはpromiseを返す。→ コードの修正により、今回は使わなかった。

export const getCurrentUser = async (req, res) => {
  const userWithPassword = await User.findOne({ _id: req.user.userId });
  // 先にauthenticateUserミドルが呼ばれてるから、verifyJWT後でreq.userが付いた状態で呼び出される。
  // ミドルとコントローラー間は一つのrequestとして扱われるが、一連が終わればreqは終了し、ユーザー情報もreqと共に消える。
  // findById()でOk。findOneを使う場合は、idにはアンダーバーをつけることに留意。
  const user = userWithPassword.toJSON();
  // toJSONは、UserSchemaにおいてpasswordを除くように上書きしている。
  res.status(StatusCodes.OK).json({ user });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  // mongodbにおいて、テーブルはcollection、レコードはdocument。
  // モデル(collection)のレコード(document)の数を数えるメソッドがcountDocument()。
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
  // usersとjobsの数を返している。
};

export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  // req.bodyはfile以外のformDataを参照してる。multerミドルによってreq.fileが作られて、fileはそちらが参照。
  // 下記にてpasswordを除き、newUserにavatarとavatarPublicIdのプロパティを加えて、Userモデルをアップデートする。
  delete newUser.password;
  // パスワードはハッシュ処理する必要があるため、他のユーザー情報と同じようにupdateすることはできない。
  // ユーザー登録(register)時と同様にbcryptでハッシュ処理すれば良いが、パスワード変更は別で行われるのが一般的。
  if (req.file) {
    // req.fileが無い場合は、formDataに画像ファイルが無い。その場合はcloudinaryの処理は不要。
    const file = formatImage(req.file)
    // multerミドルによってバッファ化されたデータを、DataParserを使って元のファイル形式に戻している。
    const response = await cloudinary.v2.uploader.upload(file);
    // このuploadは、cloudinaryのupload。ファイルをクラウドにアップロードする。
    // cloudinaryはresponseオブジェクトを返し、必要な項目を下記にて取り出している。

    // 下記はmulterのdiskStorageを使った場合の説明。今回はmemoryStorageを使うが、一応メモとして残す。
      // profileのupdateを送信すると、まずmulterミドルがpublic/uploadにfileをuploadする。
      // multerは、requestにfile.pathを付け、fileのpathにアクセスできるようにする。
      // cloudinaryがfile.pathを参照し、画像をクラウドにuploadする。
      // cloudinaryはresponseオブジェクトを返し、必要な項目を下記にて取り出している。

    newUser.avatar = response.secure_url;
    // cloudinaryは、クラウド上のfileの保存先のリンクをsecure_urlで渡してくれる。
    newUser.avatarPublicId = response.public_id;
    // cloudinaryは、クラウド上のフォルダ名とファイル名(拡張子除く)からpublic_idを作成する。
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);
  // オプションの{new: true}を外しているから、updatedUserには更新前の古いuser情報が入っている。
  // findByIdAndUpdateは、渡されたデータから変更が必要な箇所だけをアップデートしてくれる。
  // データからpasswordを除いているが、それによりDBのパスワードがnullに修正されることはない。
  // findOneの時は toJSON してからres.jsonしたが、findByIdAndUpdateとはリターンされる形式が違うのか？

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
    // updatedUserは変更前のユーザーだから、avatarPublicIdには変更前の画像のIDが入る。
    // cloudinary上のファイルを削除する場合は、destroyメソッドにファイルpublic_idを入れる。
    // Cloudinaryのサービスはデータ量に応じて請求されるから、不要なファイルは消していくべき。
  }

  res.status(StatusCodes.OK).json({ msg: 'update user' });
};
