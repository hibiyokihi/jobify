import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 4rem;
  h2 {
    text-transform: none;
    /* index.cssで、capitalizeにしてるから上書き。ここではh2は表示するものがなかった時に表示する文字 */
  }
  & > h5 {
    /* sectionのdirect childであるh5に対する設定 */
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .jobs {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
    /* 1列だからrowのgapだけ設定する */
  }
  @media (min-width: 1120px) {
    .jobs {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      /* 2列だからrowとcolumnの両方にgapを設定する */
    }
  }
`;
export default Wrapper;
