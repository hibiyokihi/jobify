import Wrapper from '../assets/wrappers/BigSidebar';
import { FaTimes } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardLayout';
import NavLinks from './NavLinks';
import Logo from './Logo';

const BigSidebar = () => {
  const { showSidebar, toggleSidebar } = useDashboardContext();
  return (
    <Wrapper>
      <div className={`sidebar-container ${!showSidebar && 'show-sidebar'}`}>
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar />
          {/* isBigSidebar=True。Bigの時だけこの変数が渡され、onClickにトグルがセットされる */}
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
