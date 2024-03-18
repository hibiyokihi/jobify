import styled from 'styled-components';

const Wrapper = styled.article`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  display: grid;
  grid-template-rows: 1fr auto;
  /* headerとcontent(centerとfooter)の２要素を、1列２行で表示する。template-rowsであることに注意 */
  /* content(centerとfooter)の高さを変えずに、header部分で調整される */
  box-shadow: var(--shadow-2);
  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    grid-template-columns: auto 1fr;
    /* 2列グリッドでアイコンの幅は変えずにテキスト部分で調整する */
    align-items: center;
  }
  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    /* アイコンの文字を中央に配置するためのグリッド使用 */
    background: var(--primary-500);
    border-radius: var(--border-radius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    margin-right: 2rem;
  }
  .info {
    h5 {
      margin-bottom: 0.5rem;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      letter-spacing: var(--letter-spacing);
      color: var(--text-secondary-color);
    }
  }
  .content {
    padding: 1rem 1.5rem;
  }
  .content-center {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    display: grid;
    grid-template-columns: 1fr;
    /* タブレットサイズ以下の場合は1列グリッド。その他は2列グリッド。 */
    row-gap: 1.5rem;
    align-items: center;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
  }
  .status {
    border-radius: var(--border-radius);
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    text-align: center;
    width: 100px;
    height: 30px;
    display: grid;
    align-items: center;
    /* backgroundとcolorは、jobStatusに応じてindex.cssで設定される */
  }
  .actions {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    /* ボタンを横並びに上下中央に */
  }
  .edit-btn,
  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }
  .edit-btn {
    margin-right: 0.5rem;
  }
`;

export default Wrapper;
