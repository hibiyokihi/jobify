import styled from 'styled-components';

const Wrapper = styled.aside`
  display: none;
  /* 小さい画面の時はBigSidebarは非表示にしてる */

  @media (min-width: 992px) {
    /* サイドバーは基本は左に隠れるようにして、show-sidebarクラスが付くと右移動して表示される。 */
    display: block;
    box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
    .sidebar-container {
      background: var(--background-secondary-color);
      min-height: 100vh;
      height: 100%;
      width: 250px;
      margin-left: -250px;
      /* デフォルトは左側に隠れている。show-sidebarが付くとmargin-leftが上書きされて登場する。 */
      transition: margin-left 0.3s ease-in-out;
      /* margin-leftが-250から0に変わる際のトランジションにアニメーションを付けてる */
    }
    .content {
      position: sticky;
      top: 0;
    }
    .show-sidebar {
      margin-left: 0;
    }
    header {
      height: 6rem;
      display: flex;
      align-items: center;
      padding-left: 2.5rem;
    }
    .nav-links {
      padding-top: 2rem;
      display: flex;
      flex-direction: column;
    }
    .nav-link {
      /* SmallSidebarにも同名クラスにCSSを設定しているが、styled-CSSを使っているから干渉しない */
      display: flex;
      align-items: center;
      color: var(--text-secondary-color);
      padding: 1rem 0;
      padding-left: 2.5rem;
      text-transform: capitalize;
      transition: padding-left 0.3s ease-in-out;
      /* hover時にpadding-leftが2.5から3remに増える(右にずれる)。この時のトランジションを設定する */
    }
    .nav-link:hover {
      padding-left: 3rem;
      color: var(--primary-500);
      transition: var(--transition);
      /* hover時にテキストの色が変更される際にトランジションを適用 */
    }
    .icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      display: grid;
      place-items: center;
    }
    .active {
      color: var(--primary-500);
    }
    .pending {
      background: var(--background-color);
    }
    /* react-routerのNavLinkによる状態管理クラスの中に、active, pending, transitioningがある。 */
  }
`;
export default Wrapper;
