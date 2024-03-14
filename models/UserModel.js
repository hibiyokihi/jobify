import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'last name',
  },
  location: {
    type: String,
    default: 'my city',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

UserSchema.methods.toJSON = function(){
  let obj = this.toObject()
  // resの際にpasswordを除きたいからtoJSONメソッドを上書きする。
  // 呼び出し元のUserインスタンス(this)をオブジェクト形式に変換する。これによりobj.passwordでパスワードにアクセスできる。
  // この後でobjの中身を変更するからletを使う。
  delete obj.password
  return obj
}
// Userインスタンスからパスワードを取り除くカスタムメソッドをUserSchemaに規定する。toJSONは任意のメソッド名。
// instanceメソッド：そのモデルのインスタンスが使えるメソッド　⇔ staticメソッド：全てのモデルが使えるメソッド
// 関数の書き方として、function(){}を使う場合は、そのインスタンスのことをthisで表せる。allowFnではthisを使えない。
// よって、instanceメソッドを規定する時はfunction()を使った方が良い。

export default mongoose.model('User', UserSchema);
// Userモデルを作ると、DB側でusersというcollectionが作成される。
