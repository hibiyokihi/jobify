import styled from 'styled-components';

const Wrapper = styled.nav`
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  background: var(--background-secondary-color);
  .nav-center {
    display: flex;
    width: 90vw;
    align-items: center;
    justify-content: space-between;
  }
  .toggle-btn {
    background: transparent;
    border-color: transparent;
    font-size: 1.75rem;
    /* アイコンのサイズはfont-sizeで変更できる */
    color: var(--primary-500);
    cursor: pointer;
    display: flex;
    align-items: center;
    /* アイコンを上下センターに置きたいからflexを使ってる */
  }
  .logo-text {
    display: none;
  }
  .logo {
    display: flex;
    align-items: center;
    width: 100px;
  }
  .btn-container {
    display: flex;
    align-items: center;
  }
  @media (min-width: 992px) {
    position: sticky;
    top: 0;
    /* 大きい画面の時のnav全体の挙動。OutletのコンテンツがスクロールしてもNavバーは上に残るようにする。 */
    .nav-center {
      width: 90%;
    }
    .logo {
      display: none;
    }
    .logo-text {
      display: block;
    }
    /* 大きい画面の時は中央にはロゴの代わりにテキストを表示する。左上のBigSidebarにロゴを表示する。 */
  }
`;
export default Wrapper;
