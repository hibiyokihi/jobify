import { Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { Logo, FormRow } from '../components';

const Login = () => {
  return (
    <Wrapper>
      <form className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" defaultValue="suzu@example.com" />
        <FormRow type="password" name="password" defaultValue="test123" />
        {/* defaultValueを設定してるのは、テストする時にいちいち入力する手間を省くため。本番用では消す。 */}

        <button type="submit" className="btn btn-block">
          login
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
      </form>
    </Wrapper>
  );
};
export default Login;
