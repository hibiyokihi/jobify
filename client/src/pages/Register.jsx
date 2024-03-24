import { Form, redirect, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { Logo, FormRow, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  // 通常のformの場合、ブラウザがFormDataをrequest.bodyに入れてサーバーに送る。
  // react-routerのFormの場合、ブラウザのデフォルトの挙動を止めて、routeのactionにfromDataを含んだrequestを送る。
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // 上記２行は形式的なものだからこの通り書く。
  // 受け取ったrequestからformData(入力内容)を取り出して、オブジェクトに変換する
  try {
    await customFetch.post('/auth/register', data);
    // axios.createでapiのbaseURLを設定してあるから、その先のpathについてhttpメソッドを規定する。
    toast.success('Registration successful');
    // 引数にはメッセージを入れる。
    return redirect('/login');
    // route内の画面遷移には通常useNavigateを使うが、フックはコンポの中でしか使えないから、action関数内ではredirectを使う。
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    // axiosでフェッチ中にエラーが生じた場合、errorにはAxiosErrorが入る。
    // AxiosError.response.data.msgにエラーメッセージが入っている。念の為?でバグ回避。
    return error;
  }
  // react-routerのactionは必ず何かをreturnする必要がある。何も無ければnullをreturn。catchも然り。
};

const Register = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        {/* formではなくreact-router-domのForm。routerでactionを使いたいから。 */}
        {/* Formのデフォルトのmethodはget。ここではpostを指定する。 */}
        <Logo />
        <h4>Register</h4>
        <FormRow type="text" name="name" />
        <FormRow
          type="text"
          name="lastName"
          labelText="last name"
          defaultValue="Hirose"
        />
        <FormRow type="text" name="location" />
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />

        <SubmitBtn />
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Register;
