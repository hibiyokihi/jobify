import styled from 'styled-components';

const Wrapper = styled.aside`
  @media (min-width: 992px) {
    display: none;
  }
  /* 大きい画面の時は <SmallSidebar> を非表示にしてる */

  .sidebar-container {
    /* サイドバーをモーダルで表示する。基本は隠れるようにして、show-sidebarクラスが付くと上書き表示される。 */
    position: fixed;
    inset: 0;
    /* insetは、top:0, left:0, bottom:0, right:0 と同様。bottomとrightを0にすることで、画面全体に表示される。 */
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: -1;
    /* z-indexを使うと、より大きい数字の要素が前に表示される。z-indexを小さくすることでメインの裏に隠す。 */
    opacity: 0;
    visibility: hidden;
    /* 確実に隠れるように透明にしてhiddenにしてる */
    transition: var(--transition);
  }
  .show-sidebar {
    z-index: 99;
    /* show-sidebarクラスが付くと、<SmallSidebar>が手前に来てメインを覆い隠すように。 */
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
    /* 閉じるボタンの位置を左上にabsoluteするため、ここを基準にする。 */
    display: flex;
    align-items: center;
    flex-direction: column;
    /* 閉じるボタン、ロゴ、NavLinksを縦方向に左右中央に並べる。閉じるボタンの位置はabsoluteで上書きして左に寄せてる */
  }
  .close-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    /* relativeである親要素(content)を基準にした位置 */
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
    /* div内に展開されたNavLinkを縦に並べる */
  }
  .nav-link {
    display: flex;
    align-items: center;
    /* 各NavLinkのアイコンと文字に横に並べて上下中央に揃える */
    color: var(--text-secondary-color);
    padding: 1rem 0;
    text-transform: capitalize;
    transition: var(--transition);
    /* SmallSlidebarでは、選択時にメニューが右にズレるtransitionは無い。hover時の色変更をスムーズにしてるのだろう。 */
  }
  .nav-link:hover {
    color: var(--primary-500);
  }
  .icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    display: grid;
    place-items: center;
    /* gridと一緒に使うことで、上下左右の中央揃えできる。 */
  }
  .active {
    /* LinkではなくNavLinkを使うと、選択中の項目にactiveクラスが付く */
    color: var(--primary-500);
  }
`;
export default Wrapper;
