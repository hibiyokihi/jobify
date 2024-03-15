import styled from 'styled-components';

const Wrapper = styled.section`
  .dashboard {
    display: grid;
    grid-template-columns: 1fr;
  }
  .dashboard-page {
    width: 90vw;
    margin: 0 auto;
    padding: 2rem 0;
  }
  @media (min-width: 992px) {
    .dashboard {
      grid-template-columns: auto 1fr;
    }
    // 大きい画面の時は2列グリッドで左側はBigSidebarに必要な幅を残す
    .dashboard-page {
      width: 90%;
    }
  }
`;
export default Wrapper;
