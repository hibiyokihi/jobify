import {
  Form,
  redirect,
  useNavigation,
  Link,
} from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { Logo, FormRow } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  // 説明書きはRegister.jsx参照
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // 下記のように、サーバーにデータを送る前にエラーチェックをすることもできる。
  // const errors = { msg: '' };
  // if (data.password.length < 5) {
    //   errors.msg = 'password too short';
    //   return errors;
    // }
  // returnしてるから、if文に入ったらFetchは実行されずに終了する。
  // コンポーネント内でaction内の変数(errors)にアクセスしたい場合、useActionData()を使用する。

  try {
    await customFetch.post('/auth/login', data);
    toast.success('Login successful');
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  // const errors = useActionData()
  // action内の変数にアクセスする場合のuseActionData()の使用例。今回は使わない。
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" defaultValue="suzu@example.com" />
        <FormRow type="password" name="password" defaultValue="test123" />
        {/* defaultValueを設定してるのは、テストする時にいちいち入力する手間を省くため。本番用では消す。 */}

        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'submitting...' : 'submit'}
        </button>
        <button type="button" className="btn btn-block">
          explor the app
        </button>
        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
