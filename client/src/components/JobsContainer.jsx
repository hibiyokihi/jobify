import Wrapper from '../assets/wrappers/JobsContainer';
import Job from './Job';
import { useAllJobsContext } from '../pages/AllJobs';

const JobsContainer = () => {
  const { data } = useAllJobsContext();
  const { jobs } = data;
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="jobs">
        {/* <h4>{`${jobs.length} jobs found`}</h4> */}
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
          // jobsにはjobのArrayが、jobにはJobクラスのkey-valueがオブジェクトに入っている。
          // スプレッドすることで、オブジェクトの中身をpropsとして渡せる。
        })}
      </div>
    </Wrapper>
  );
};
export default JobsContainer;
