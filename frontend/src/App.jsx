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
// ファイル名を指定しなければデフォルトでindex.jsを探すから、ここではindex.jsは記載不要
// 一つ一つインポートするより、index.jsに集約してインポートする方が簡潔に書ける。

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true'
  // localStorageのvalueはstringで保存される。これをbooleanに戻すために上記の記載となる。
  // DashboardLayoutのtoggleDarkTheme関数を合わせて参照
  document.body.classList.toggle('dark-theme', isDarkTheme)
  // isDarkThemeがtrueならbodyに'dark-theme'クラスが追加される。
  // ※ bodyタグには元々dark-themeクラスは付いてないから、クラスを追加しても画面がリフレッシュされると消えてしまう。
  return isDarkTheme
  // toggleDarkThemeでダークを選択した際にはlocalの'darkTheme'に'true'が記録される。
  // DashboardLayoutのレンダー時にこの関数が実行され、isDarkThemeにtrueが入ってリターンされる。
  // その結果がuseStateのisDarkThemeに反映される形で、毎回の利用時にデフォルトのダークモード選択が適用される。
  // ダークモードの設定はページ全体に影響を与えるため、トップページに記載すること。
}

checkDefaultTheme()
// classList.toggleを実行するため、この関数をAppで実行する必要がある。

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    // routerのどこかでエラーが発生すると、バブルアップして親のerrorElementが参照されるらしい。
    children: [
      // children内のelementは、親のコンポーネントの中で<Outlet />を置いた部分に置き換わる。
      // 親のPath(/)へのアクセスの際にOutletに表示するchildは、pathの代わりにindex: trueとする。
      // childrenのpathの頭に/は付けなくてよい
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
