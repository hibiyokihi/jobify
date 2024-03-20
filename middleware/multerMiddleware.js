import multer from 'multer';
// server.jsの中に書いても良いが、今回はミドルを作ることにする。
// multipart/form-dataを処理するからmulterという名前なのだろう。
// multerにはmemoryStorageとdiskStorageの選択肢があるが、diskを選択。fileはcloudinaryに送るため。
// image-fileをpublicに保存しても、本番環境でデプロイした後ではpublicは使えない。よってCloudinaryを使う。
// * デプロイ後、アプリケーションがsleep状態に入った時にpublicのimageは全て消えてしまうとのこと。
// ※ おそらくpublicはstaticファイルの置き場所であり、追加変更のあるダイナミックな使い方はできないということだろう。
// Cloudinaryはクラウド上にimageを保存し、作成されたURLを使ってフロントから画像にアクセスできる。

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    // cbはcall-backの略
    cb(null, 'public/uploads');
    // 第一引数はErrorの場合の処理、第二引数がfileのdestination
  },
  filename: (req, file, cb) => {
    // 今回は、fileをすぐにcloudinaryに送るからfilenameは必ずしも必要ない
    const filename = file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export default upload