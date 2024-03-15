import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { Logo, FormRow } from '../components';

const Register = () => {
  return (
    <Wrapper>
      <form className="form">
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
        <FormRow type="password" name="password" defaultValue="test123" />
        {/* defaultValueを設定してるのは、テストする時にいちいち入力する手間を省くため。本番用では消す。 */}

        <button type="submit" className="btn btn-block">
          submit
        </button>
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};
export default Register;
