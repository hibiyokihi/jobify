export { default as DashboardLayout } from './DashboardLayout';
// これはimportとexportを同時に行うための省略形。省略せずに書いた場合は以下の通り。
// import DashboardLayout from './DashboardLayout' >> default exportされたものをインポートしてる。
// export { DashboardLayout } >> 複数Exportするからnamed exportにする必要あり。

// インポート先からexport defaultされた場合、'default'という名前でnamed exportされる。
// この場合、通常は'default'をnamed importするのではなく、'import 好きな名前 from...'のようにして良い。
// 但し、以下のように'default'にエイリアスを付けてnamed importをすることもできる。
// import { default as DashboardLayout } from './DashboardLayout';
// この構文を使った場合、importをexportに書き換えると、importとexportを両方行なってくれる。
// defaultはあくまでインポート側の話で、exportはエイリアス名を使ってnamedで行われている。

export { default as AllJobs } from './AllJobs';
export { default as AddJob } from './AddJob';
export { default as Admin } from './Admin';
export { default as EditJob } from './EditJob';
export { default as Error } from './Error';
export { default as HomeLayout } from './HomeLayout';
export { default as Landing } from './Landing';
export { default as Login } from './Login';
export { default as Profile } from './Profile';
export { default as Register } from './Register';
export { default as Stats } from './Stats';
