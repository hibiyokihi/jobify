import styled from 'styled-components';

const Wrapper = styled.section`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
    margin-bottom: 1.5rem;
  }
  p {
    line-height: 2;
    color: var(--text-secondary-color);
    margin-bottom: 1.5rem;
    max-width: 35em;
  }
  .register-link {
    margin-right: 1rem;
  }
  .main-img {
    display: none;
  }
  .btn {
    padding: 0.75rem 1rem;
  }
  @media (min-width: 992px) {
    /* 上記は全て小さい画面で見た時のCSS。992px以上の画面で見た時には下記が適用される */
    .page {
      grid-template-columns: 1fr 400px;
      column-gap: 3rem;
      /* 小さい画面では1列のGrid、大きい画面だと2列Gridにする。右列の幅を固定。 */
    }
    .main-img {
      display: block;
      /* 小さい画面ではNoneにして、大きい画面では2列グリッドの右側に表示されるようにする。
      Gridの中に要素が２つ(divとimg)あり、imgはinline要素だから横並びになりGridが効かないから、
      blockにして一旦divの下に置くことで2列Gridが効いて右列に収まる。
      */
    }
  }
`;
export default Wrapper;
