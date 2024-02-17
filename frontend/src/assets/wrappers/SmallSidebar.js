import styled from 'styled-components';

const Wrapper = styled.aside`
  @media (min-width: 992px) {
    display: none;
  }
  /* 大きい画面の時はSmallSidebar自体を非表示にしてる */
  .sidebar-container {
    position: fixed;
    inset: 0;
    /* top:0, bottom:0, left:0, right:0 をまとめたもの。全画面表示にする。 */
    background: rgba(0, 0, 0, 0.7);
    /* モーダルの背景と同じ役割だから黒の半透明 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: -1;
    /* show-sidebarが付いてない時は必ずこの要素は他の要素の裏に隠れてhiddenになる */
    /* モーダル部分(コンテンツ)の表示を動かすのでなく、グレー背景の表示を前後に動かす */
    opacity: 0;
    visibility: hidden;
    /* 確実に隠れるように透明にしてhiddenにしてる */
    transition: var(--transition);
  }
  .show-sidebar {
    z-index: 99;
    /* show-sidebarが付いてる時は必ずこの要素が手前に来て他の要素を覆い隠す。 */
    opacity: 1;
    visibility: visible;
    /* デフォルトの処理を裏返して表示されるようにしてる */
  }
  .content {
    background: var(--background-secondary-color);
    width: var(--fluid-width);
    height: 95vh;
    border-radius: var(--border-radius);
    padding: 4rem 2rem;
    position: relative;
    /* 子要素のabsoluteの位置の基準になる */
    display: flex;
    align-items: center;
    flex-direction: column;
    /* buttonとheaderを縦方向に左右中央に並べる。buttonは位置をabsoluteで上書きしてる */
  }
  .close-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    /* relativeである親要素を基準にした位置 */
    background: transparent;
    border-color: transparent;
    font-size: 2rem;
    color: var(--red-dark);
    cursor: pointer;
  }
  .nav-links {
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
  }
  .nav-link {
    display: flex;
    align-items: center;
    color: var(--text-secondary-color);
    padding: 1rem 0;
    text-transform: capitalize;
    transition: var(--transition);
  }
  .nav-link:hover {
    color: var(--primary-500);
  }
  .icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    display: grid;
    /* アイコンをセンターに寄せるために1列Gridを使ってるだけ */
    place-items: center;
  }
  .active {
    color: var(--primary-500);
  }
`;
export default Wrapper;
