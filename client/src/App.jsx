import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  Admin,
} from './pages';
// pages/index.jsからまとめてインポートしている。ファイル名の指定が無ければデフォルトでindex.jsから探してくる。
// index.jsに集約しないと、page毎にインポートを記載する必要があるから行数が多くなる。

export const checkDefaultTheme = () => {
  // DashboardLayout.jsxでも使うからエクスポートしてる。
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true'
  // localStorageのvalueはstringで保存される。これをbooleanに直すために上記のように書く。
  // DashboardLayoutのtoggleDarkTheme関数を合わせて参照
  document.body.classList.toggle('dark-theme', isDarkTheme)
  // htmlのbodyには元々'dark-theme'クラスは付いてないから、画面をリフレッシュすると消えてしまう。
  // localStorageの'darkTheme'の値に応じて、レンダー時にhtmlのクラスを正しい状態に修正するのが目的。

  // classListは、特定の要素のクラス名をadd, remove, toggle, contain(存在確認) できるプロパティ。
  // toggleは、引数1つの場合には、単純にその要素内にそのクラスが有れば除き、無ければ追加する。
  // toggleの第2引数にbooleanを置いた場合、トグルを一方通行にできる。trueなら追加のみ、falseなら削除のみ。
  // isDarkThemeがtrueの場合、'dark-theme'クラスが無ければ追加、既に有れば何もしない、そのために第2引数をtrueにする。

  return isDarkTheme
}

checkDefaultTheme()
// ダークモードの設定はページ全体に影響を与えるため、トップページに記載する。
// localStorageに'darkTheme'が保管されることで、毎回の利用時にデフォルトのダークモード選択が適用される。

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    // router内でエラーが発生した場合には、errorEelementで指定したコンポーネントが呼び出される。
    // errorElementは、各path毎に設定することもできる。
    // エラーが発生したpathにerrorElementの指定が無い場合は、バブルアップして探しに行く。
    // トップレベルrouteのerrorElementは、最終的な受け皿。ここで止めないとブラウザdefaultのエラー画面が出てしまう。
    children: [
      // children内のelementは、親コンポーネント(HomeLayout)の中で<Outlet />を置いた部分に置き換わる。
      // 親のPath(/)へのアクセスの際にOutletに表示させたいchildは、pathの代わりにindex: trueとする。
      // childrenのpathの頭に/は付けなくてよい。
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          // children in children。/dashboardにアクセスがあったら、indexの<AddJob />が開く。
          {
            index: true,
            element: <AddJob />,
          },
          {
            path: 'all-jobs',
            element: <AllJobs />,
          },
          {
            path: 'stats',
            element: <Stats />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'admin',
            element: <Admin />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
