import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  .logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
  }
  .img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
  .dropdown {
    /* これは中身のbuttonではなく箱であるdivに対して付いているクラスであることに注意 */
    position: absolute;
    top: 45px;
    left: 0;
    width: 100%;
    box-shadow: var(--shadow-2);
    text-align: center;
    visibility: hidden;
    border-radius: var(--border-radius);
    background: var(--primary-500);
  }
  /* visibilityのデフォルトをhiddenとして、show-dropdownが付くとvisibleに上書きされる */
  .show-dropdown {
    visibility: visible;
  }
  .dropdown-btn {
    /* div(.dropdown)の中に入っているbutton。transparentにすることで親のdivと一体化する */
    border-radius: var(--border-radius);
    padding: 0.5rem;
    background: transparent;
    border-color: transparent;
    color: var(--white);
    letter-spacing: var(--letter-spacing);
    text-transform: capitalize;
    cursor: pointer;
    width: 100%;
    height: 100%;
    /* buttonの幅は中身の文字の横幅で設定される。このままだと、親divの端の方をクリックするとボタンが押されない。
    幅と高さを親のdivに一致させることで、divのどこを押してもボタンがクリックされる */
  }
`;

export default Wrapper;
