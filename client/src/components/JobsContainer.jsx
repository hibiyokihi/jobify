import Wrapper from '../assets/wrappers/JobsContainer';
import Job from './Job';
import { useAllJobsContext } from '../pages/AllJobs';
import PageBtnContainer from './PageBtnContainer';

const JobsContainer = () => {
  const { data } = useAllJobsContext();
  const { jobs, totalJobs, numOfPages } = data;
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {totalJobs} job{totalJobs > 1 && 's'} found{' '}
      </h5>
      <div className="jobs">
        {/* <h4>{`${jobs.length} jobs found`}</h4> */}
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
          // jobsにはjobのArrayが、jobにはJobクラスのkey-valueがオブジェクトに入っている。
          // スプレッドすることで、オブジェクトの中身をpropsとして渡せる。
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default JobsContainer;
