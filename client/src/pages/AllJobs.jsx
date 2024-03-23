import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';

export const loader = async ({ request }) => {
  // loaderは、<AllJobs>のFormからgetリクエストされた際にも発動する。
  // Formでgetリクエストを送ると、現在のpath(all-jobs)に対してquery付きのgetリクエストを送ることになるから。
  // request.urlで、リクエストが行われた際のurlが取得される。
  // 最初にall-jobsのページに遷移した際には、urlのquery-paramsには何も入っていない。
  // <AllJobs>のFormからgetリクエストされた際には、urlにquery-paramsが入っており、下記Object.fromEntriesが機能する。
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  // URLインスタンスのsearchParamsメソッドは、URLSearchParamsインスタンスを返し、url内のquery-paramsへのアクセスを可能にする。
  // entriesメソッドは、query-paramsのそれぞれのkey-valueを[key, value]のArray形式にしてiteratorを返す。
  // このiteratorをArrayの中でスプレッドすることで、[[key1, value1], [key2, value2]...]のArrayが作られる。
  // Object.fromEntriesは、上記のような形式のIterable(Array等)を受けて、{key1:value1, key2:value2...}のようにオブジェクトを返す。
  try {
    const { data } = await customFetch.get('/jobs', { params });
    // fetchして戻されるresponseは大きなオブジェクトであり、その中からdataをdestructureする。
    // 第二引数はオプション。paramsにqueryをkey-valueにして入れると、サーバー側でreq.queryとして受け取られる。(axiosの機能)
    return { data, searchValues: {...params} };
    // paramsをスプレッドしてオブジェクトに入れ直してる。理由は不明。
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobsContext = createContext();
// ここではContextを使うが、propsで渡しても問題ない。

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();
  // オブジェクトに包まれたdataからdataをdestructureしてる。

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
