import { useDashboardContext } from '../pages/DashboardLayout';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';

const NavLinks = ({isBigSidebar}) => {
  const { toggleSidebar, user } = useDashboardContext();
  return (
    <div className="nav-links">
    {links.map((link) => {
      const { text, path, icon } = link;
      return (
        <NavLink
          to={path}
          key={text}
          className="nav-link"
          onClick={!isBigSidebar && toggleSidebar}
          // SmallSidebarからの呼び出し時はisBigSidebarは渡されないからNull、よってonClickにはトグルがセットされる。
          // BigSidebarからの呼び出し時は渡されるからFalseになってtoggleはセットされない。
          end
          // NavLinkはRoute上でdashboardの階層にあり、そのトップページであるAddJobは常にアクティブ扱いになってしまう。
          // endを付けることで、これを回避できる。
        >
          <span className="icon">{icon}</span>
          {text}
        </NavLink>
      );
      // NavLinkとLinkの違いの一つは、NavLink内の選択中の要素にはactiveクラスが付く。
    })}
  </div>
  )
}
export default NavLinks