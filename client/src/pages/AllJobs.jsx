import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/jobs');
    // fetchして戻されるresponseは大きなオブジェクトであり、その中からdataをdestructureする。
    return { data };
    // 理由があり、ここではdataをオブジェクトに包んでリターンしてる。
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobsContext = createContext();
// ここではContextを使うが、propsで渡しても問題ない。

const AllJobs = () => {
  const { data } = useLoaderData();
  // オブジェクトに包まれたdataからdataをdestructureしてる。

  return (
    <AllJobsContext.Provider value={{ data }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
