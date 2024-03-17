import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
// toastifyを使う場合の規定のcss。一部変更したい場合はindex.cssで上書きする。
import './index.css';

import { ToastContainer } from 'react-toastify';


// 以下のコードは後で消すこと。メモを参考用に取ってある。適切な場所にメモを移動すること。
// import customFetch from '../../utils/customFetch.js';
// const res = await customFetch.get('/test');
// // customFetchでaxiosのbaseURL('/api/v1)を定めてるから、チェーン先のpathはその先を書けば良い。
// // この方法によれば、baseURLが変わった場合の対応が容易。
// console.log(res.data)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer position='top-center' />
    {/* ToastContainerをレンダーした先の階層でtoastを使える。通常はトップに置く。 */}
  </React.StrictMode>
);
