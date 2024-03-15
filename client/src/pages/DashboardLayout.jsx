import { Outlet } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { Navbar, BigSidebar, SmallSidebar } from '../components';
import { createContext, useContext, useState } from 'react';
import { checkDefaultTheme } from '../App';

const DashboardContext = createContext();
// global contextを使う場合、createContextから作ったProviderで全体を囲う。
// contextで使いたいstateをProviderのvalueに渡し、使う際にはuseContext()で呼び出す。
// このケースのglobal stateであれば、少ないからcontextは使わずにpropsで渡してもOK。

const DashboardLayout = () => {
  const user = { name: 'suzu' };
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
  // useState()の初期値を決める関数は、マウント時に一回だけ実行される。
  // checkDefaultThemeは、localStorageの'darkTheme'のtrue/falseを返す。
  // 同時に、そのtrue/falseに応じて'dark-theme'クラスの追加/削除を行う。

  const toggleDarkTheme = () => {
    setIsDarkTheme((prev) => !prev);
    // setStateは最後にまとめて実行されるから、この関数内ではisDarkThemeはまだトグル前の状態。
    document.body.classList.toggle('dark-theme', !isDarkTheme);
    // localStorageの'darkTheme'が現状trueの場合、stateのisDarkThemeもtrueになり、'dark-theme'クラスが付いている。
    // toggleの第2引数にfalseにすることで、'dark-theme'クラスを取り除く一方通行の処理がされる。
    // 逆に'darkTheme'が現状falseの場合、toggleの第2引数はtrueになり、'dark-theme'クラスを追加する一方通行処理がされる。

    // classListは、特定の要素のクラス名をadd, remove, toggle, contain(存在確認) できるプロパティ。
    // toggleは、引数1つの場合には、単純にその要素内にそのクラスが有れば除き、無ければ追加する。
    // toggleの第2引数にbooleanを置いた場合、トグルを一方通行にできる。trueなら追加のみ、falseなら削除のみ。

    localStorage.setItem('darkTheme', !isDarkTheme);
    // 上記は、ローカルStateのトグルと'dark-theme'クラスの修正をしただけだから、localStorageのトグルも必要。
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    console.log('logout user');
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
      // <DashboardLayout>の子elementにおいて、上記のstateをcontextから呼び出せる。
    >
      <Wrapper>
        <main className="dashboard">
          {/* 小さい画面の時は1列グリッドでSmallSidebarはモーダルにしてメインを表示する。ハンバーガーでトグル。 */}
          {/* 大きい画面の時は2列グリッドでBigSidebarとメインを左右に並べる。サイドバーは左に隠して、トグルで右移動して表示 */}
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet />
              {/* Outletの中では、react-router独自のglobal contextを使えるからuseContextは不要。 */}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};
export const useDashboardContext = () => useContext(DashboardContext);
// 普通のやり方だと、使う側でいちいちuseContextとDashboardContextをインポートする必要がある。
// カスタムHookにすることで、これ一つをインポートすればcontextを使える様になる。
// カスタムhookを作る際の名前の頭にはuseをつけること。

export default DashboardLayout;
