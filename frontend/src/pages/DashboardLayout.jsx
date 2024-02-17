import { Outlet } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { Navbar, BigSidebar, SmallSidebar } from '../components';
import { createContext, useContext, useState } from 'react';
import { checkDefaultTheme } from '../App';

const DashboardContext = createContext();
// global contextを使う場合、createContextから作ったProviderで全体を囲う。
// Providerに使いたいstateをvalueに渡し、使う際にはuseContext()で呼び出す。
// このケースのglobal stateであれば、少ないからcontextは使わずにpropsで渡してもOK。

const DashboardLayout = () => {
  const user = { name: 'suzu' };
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());

  const toggleDarkTheme = () => {
    setIsDarkTheme((prev) => !prev);
    document.body.classList.toggle('dark-theme', !isDarkTheme);
    // element(ここではbodyエレメント)に指定クラス名(ここでは'dark-theme')が付いてれば削除し、無ければ追加する。
    // 第1引数だけでは動かないこともあるようで、第2引数で挙動を強制する。第2がtrueなら追加、falseなら削除。
    // つまり、現状のisDarkThemeがfalseならbodyタグに'dark-theme'を追加、trueなら削除
    // ※バニラJSの機能でありReactとは関係ない。
    // setStateは最後にまとめて実行されるから、isDarkThemeはまだトグル前の状態。
    localStorage.setItem('darkTheme', !isDarkTheme);
    // 通常モードの時にトグルを押した場合はダークモードに変更する。isDarkThemeはまだfalseだからlocalのdarkThemeには'true'が入る。
    // ダークモードの時にトグルを押した場合は通常モードに変更する。isDarkThemeがtrueだからlocalのdarkThemeには'false'が入る。
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
    >
      <Wrapper>
        <main className="dashboard">
          {/* 小さい画面の時は1列グリッド、大きい画面の時は2列グリッドで左側はSidebarに必要な幅を提供 */}
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
// 普通のやり方だと、使う側でuseContextとDashboardContextをインポートする必要がある。
// カスタムHookにすることで、これ一つをインポートすればcontextを使える様になる。カスタムhookを作る際の名前の頭にはuseをつける。

export default DashboardLayout;
