import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { Navbar, BigSidebar, SmallSidebar } from '../components';
import { createContext, useContext, useState } from 'react';
import { checkDefaultTheme } from '../App';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

const DashboardContext = createContext();
// global contextを使う場合、createContextから作ったProviderで全体を囲う。
// contextで使いたいstateをProviderのvalueに渡し、使う際にはuseContext()で呼び出す。
// このケースのglobal stateであれば、少ないからcontextは使わずにpropsで渡してもOK。

export const loader = async () => {
  try {
    // const {data} = await customFetch.get('/users/current-user')
    const { data } = await customFetch.get('/users/current-user');
    // axios.getで返ってくるオブジェクトにはdata, status, header等が入っているから、dataをdestructureする。
    // dataの中に、サーバーからres.jsonされた{user: user情報}が入っている。
    return data;
  } catch (error) {
    // サーバー側でuserRouterに行く前にauthenticateUserミドルでtokenのチェックをしてるため、tokenエラーが有ればcatchされる。
    return redirect('/');
    // useNavigateはコンポの中でしか使えないから、action関数とloader関数内ではredirectを使う。
  }
  // actionと同様に、loader関数は必ず何かをreturnすること。catchも然り。
};

const DashboardLayout = () => {
  const { user } = useLoaderData();
  // loaderがリターンした値にアクセスする場合に使うフック。
  // ここでは、returnされたdataからuserをdestructureする処理をまとめている。
  const navigate = useNavigate();
  // 紛らわしいが、useNavigationは主にrouteのaction実行時の状態管理(submitting, loading)するのに使われる。
  // useNavigateはroute内の画面遷移の際に使われる。
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
    navigate('/');
    await customFetch.get('/auth/logout');
    toast.success('Logiing out...');
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        // loaderによりapiから取得したcurrentUser
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
              <Outlet context={{ user }} />
              {/* useOutletContextを使って、Outletに表示される各コンポでcontextを使える。valueではなくcontext。 */}
              {/* useContextを使うとProviderで囲う必要があるが、それが不要。 */}
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
