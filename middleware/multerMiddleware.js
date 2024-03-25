

import multer from 'multer';
import DataParser from 'datauri/parser.js'
import path from 'path'

// server.jsの中に書いても良いが、今回はミドルを作ることにする。
// multipart/form-dataを処理するからmulterという名前なのだろう。
// multerにはmemoryStorageとdiskStorageの選択肢があり、diskStorageの場合はpublicに画像を一時的に保存する。
// diskStorageを使う場合、画像ファイルをpublicに置くことでCloudinaryがそこから画像を取得する。
// * publicフォルダはpublically-availableだからCloudinaryもアクセスできる。
// memoryStorageを使う場合、画像ファイルはバッファ上(空きスペース？)に置いてCloudinaryがそこから画像を取得する。
// Renderを使う場合、有料版を購入しないとdiskStorageの方法は使えないから今回はmemoryStorageを採用する。
// memoryStorageを使う場合は、datauriライブラリを使う必要がある。
// diskStorageを使う場合も、本番環境でデプロイした後ではpublicは使えないため、Cloudinaryを使う必要がある。
// * デプロイ後、アプリケーションがsleep状態に入った時にpublicのimageは全て消えてしまうとのこと。
// Cloudinaryはクラウド上にimageを保存し、作成されたURLを使ってフロントから画像にアクセスできる。

const storage = multer.memoryStorage();
const upload = multer({ storage });
// memoryStorageを使うと、multerはメモリ上に一時保存用のstorageを作成する。
// upload.single('avatar')で、'avatar'のnameが付いたFormDataをバッファ化してstorageに保管する。

const parser = new DataParser()
// buffer化されたデータは、DataParserによって元のフォーマットに戻せる。

export const formatImage = (file) => {
  // 引数のfileはreq.fileで、multerがuploadの際に画像をbufferデータ化してメモリに保存し、それを参照してる。
  const fileExtension = path.extname(file.originalname).toString()
  // req.file.originalnameはバッファ化された画像のファイル名。そこからextension部分を取り出す。
  return parser.format(fileExtension, file.buffer).content
  // DataParserが、multerによってバッファ化されたデータを元のフォーマット形式に戻す。
}

export default upload
// named-exportしても良い。途中でコードをdiskStorageからMemoryStorageに変更したため、デフォルトのまま残しただけ。