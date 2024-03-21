import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const loader = async () => {
  try {
    const stats = await customFetch.get('/jobs/stats');
    console.log(stats)
    return stats;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Stats = () => {
  return <h1>Stats</h1>;
};
export default Stats;
