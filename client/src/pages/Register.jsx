import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { Logo, FormRow } from '../components';
import customFetch from '../utils/customFetch';

export const action = async ({ request }) => {
  // 通常のformの場合、ブラウザがFormDataをrequest.bodyに入れてサーバーに送る。
  // react-routerのFormの場合、ブラウザのデフォルトの挙動を止めて、routeのactionにrequestオブジェクトを送る。
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // 上記２行は形式的なものだからこの通り書く。
  // requestからformData(入力内容)を取り出して、オブジェクトに変換する
  try {
    await customFetch.post('/auth/register', data);
    // axios.createでapiのbaseURLを設定してあるから、その先のpathについてhttpメソッドを規定する。
    return redirect('/login');
    // redirectを使うのはactionの中だけ。それ以外は別の方法でredirectする。
  } catch (error) {
    console.log(error);
    return error;
  }
  // react-routerのactionは必ず何かをreturnする必要がある。何も無ければnullをreturn。catchも然り。
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  // submittingは、route内でFormをsubmitしてactionが実行中の状態。
  // loadingは、次のrouteに遷移するためにエレメントをレンダー中の状態。
  return (
    <Wrapper>
      <Form method="post" className="form">
        {/* formではなくreact-router-domのForm。routerでactionを使いたいから。 */}
        {/* Formのデフォルトのmethodはget。ここではpostを指定する。 */}
        <Logo />
        <h4>Register</h4>
        <FormRow type="text" name="name" defaultValue="Suzu" />
        <FormRow
          type="text"
          name="lastName"
          labelText="last name"
          defaultValue="Hirose"
        />
        <FormRow type="text" name="location" defaultValue="Tokyo" />
        <FormRow type="email" name="email" defaultValue="suzu@example.com" />
        <FormRow type="password" name="password" defaultValue="test123123" />
        {/* defaultValueを設定してるのは、テストする時にいちいち入力する手間を省くため。本番用では消す。 */}

        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'submitting...' : 'submit'}
        </button>
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
