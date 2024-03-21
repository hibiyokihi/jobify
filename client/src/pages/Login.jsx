import {
  Form,
  redirect,
  Link,
  useNavigate,
} from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { Logo, FormRow, SubmitBtn } from '../components';
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
  // const errors = useActionData()
  // action内の変数にアクセスする場合のuseActionData()の使用例。今回は使わない。
  const navigate = useNavigate()
  const loginDemoUser = async () => {
    try {
      const data = {
        "email": "test@test.com",
        "password": "secret123",
        // テストユーザーは、事前にPostmanでregister済み
      }
      await customFetch.post('/auth/login', data);
      toast.success('Test user login function');
      navigate('/dashboard')
      // コンポ内だからuseNavigateが使える。
    } catch (error) {
      toast.error(error?.response?.data?.msg);

    }
  }

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" defaultValue="suzu@example.com" />
        <FormRow type="password" name="password" defaultValue="test123" />
        {/* defaultValueを設定してるのは、テストする時にいちいち入力する手間を省くため。本番用では消す。 */}

        <SubmitBtn />
        <button type="button" className="btn btn-block" onClick={loginDemoUser}>
          explore the app
          {/* テストユーザー用のログインボタン。App内の各機能をチェックするためにテストユーザーでログインして試す目的。
          SubmitBtnからログインした場合は、Formのsubmitが実行されてrequestがactionに送られてログインプロセスに入る。
          exploreボタンを押した場合は、submitは実行されずにloginDemoUserからログインプロセスに入る。
          テストユーザーには機能に制限を設ける */}
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
