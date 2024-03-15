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
          // 大画面の時はサイドバーをトグルさせず表示したまま、小画面の時だけトグルしたい。
          // SmallSidebarでNavLinksを呼び出す時はpropsにisBigSidebarが無いからNull、よってトグルされる。
          // BigSidebarでNavLinksを呼び出す時はpropsにisBigSidebarを渡すからトグルはセットされない。
          end
          // activeクラスを付けるエレメントを判断する際、pathの終わりまで見る時はendをつける。
          // endを付けないと、ルートパスであるAddJob(/dashboard/)は常にアクティブ扱いされてしまう。
        >
          <span className="icon">{icon}</span>
          {text}
        </NavLink>
      );
      // NavLinkとLinkの違いとして、NavLinkは選択中の要素にactiveクラスが付く。
      // styled-componentsを使った場合、そのコンポ内で呼び出した他のコンポにも適用される(nav-linkクラスのこと)
    })}
  </div>
  )
}
export default NavLinks