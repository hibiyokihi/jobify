import Wrapper from '../assets/wrappers/LandingPage';
import main from '../assets/images/main.svg';
import { Link } from 'react-router-dom';
import { Logo } from '../components';

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            I&apos;m baby banjo bicycle rights kinfolk marxism lumbersexual. Man
            braid blog biodiesel distillery. Brooklyn hammock copper mug
            vexillologist letterpress polaroid photo booth hashtag lo-fi
            helvetica yes plz vegan banh mi fingerstache post-ironic. Master
            cleanse shabby chic chartreuse portland you probably haven&apos;t
            heard of them DIY, neutral milk hotel salvia. Copper mug sustainable
            selvage heirloom twee hella.
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/register" className="btn register-link">
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
