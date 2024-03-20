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
  EditJob,
} from './pages';
// pages/index.jsからまとめてインポートしている。ファイル名の指定が無ければデフォルトでindex.jsから探してくる。
// index.jsに集約しないと、page毎にインポートを記載する必要があるから行数が多くなる。

import { action as registerAction } from './pages/Register';
// actionはreact-router-domで使ってるから、他のエイリアスを用意する必要がある。
// RegisterとLoginで同じ名前(action)でexportすることで、コードを再利用できる。
import { action as loginAction } from './pages/Login';
import { loader as dashboardLoader } from './pages/DashboardLayout';
import { action as addJobAction } from './pages/AddJob';
import { loader as allJobsLoader } from './pages/AllJobs';
import { loader as editJobLoader } from './pages/EditJob';
import { action as editJobAction } from './pages/EditJob';
import { action as deleteJobAction } from './pages/DeleteJob';
import { loader as adminLoader } from './pages/Admin';
import { action as profileAction } from './pages/Profile';


export const checkDefaultTheme = () => {
  // DashboardLayout.jsxでも使うからエクスポートしてる。
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  // localStorageのvalueはstringで保存される。これをbooleanに直すために上記のように書く。
  // DashboardLayoutのtoggleDarkTheme関数を合わせて参照
  document.body.classList.toggle('dark-theme', isDarkTheme);
  // htmlのbodyには元々'dark-theme'クラスは付いてないから、画面をリフレッシュすると消えてしまう。
  // localStorageの'darkTheme'の値に応じて、レンダー時にhtmlのクラスを正しい状態に修正するのが目的。

  // classListは、特定の要素のクラス名をadd, remove, toggle, contain(存在確認) できるプロパティ。
  // toggleは、引数1つの場合には、単純にその要素内にそのクラスが有れば除き、無ければ追加する。
  // toggleの第2引数にbooleanを置いた場合、トグルを一方通行にできる。trueなら追加のみ、falseなら削除のみ。
  // isDarkThemeがtrueの場合、'dark-theme'クラスが無ければ追加、既に有れば何もしない、そのために第2引数をtrueにする。

  return isDarkTheme;
};

checkDefaultTheme();
// ダークモードの設定はページ全体に影響を与えるため、トップページに記載する。
// localStorageに'darkTheme'が保管されることで、毎回の利用時にデフォルトのダークモード選択が適用される。

const router = createBrowserRouter([
  // 以下のrouteはreact-routeであり、サーバー側のexpress-routeとは異なる。
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
        action: registerAction,
        // action関数は、formをsubmitした場合の処理Fnを規定する。必ず何かをreturnする必要あり。
        // ここでactionを定義することもできるが、見にくくなるからRagisterの方に書いてインポートしてる。
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        loader: dashboardLoader,
        // loader関数は、elementをレンダーする前に実行され、returnされた値はコンポ内で使用できる。
        // useEffectの場合はコンポーネントのレンダー開始後にFetchするが、loaderはレンダー開始時点で既に使える状態。
        children: [
          // children in children。/dashboardにアクセスがあったら、indexの<AddJob />が開く。
          {
            index: true,
            element: <AddJob />,
            action: addJobAction,
          },
          {
            path: 'all-jobs',
            element: <AllJobs />,
            loader: allJobsLoader,
          },
          {
            path: 'stats',
            element: <Stats />,
          },
          {
            path: 'profile',
            element: <Profile />,
            action: profileAction,
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: 'edit-job/:id',
            element: <EditJob />,
            loader: editJobLoader,
            // EditJobをレンダーする前にidにマッチするjobをfetchする。
            action: editJobAction,
          },
          {
            path: 'delete-job/:id',
            action: deleteJobAction,
            // 今回はdelete用のページは作らないため、elementは無し。
            // actionは、通常は同じpath内のFormからsubmitされたformDataを受けて処理を実行する。(Formにactionパラムの記載は不要)
            // deleteの場合はelementが無く、all-jobsのpathにあるFormからdelete-jobのpathにあるactionに処理を託す。
            // よって、all-jobsにあるFormにはactionパラムを置き、actionのあるpathを指定する。
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
