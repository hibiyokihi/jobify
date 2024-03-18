import Wrapper from '../assets/wrappers/DashboardFormPage';
import { Form} from 'react-router-dom';
import { FormRow, FormRowSelect } from '../components';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { useAllJobsContext } from '../pages/AllJobs';


const SearchContainer = () => {
  const {data} = useAllJobsContext()

  return (
    <Wrapper>
    <Form method="post" className="form">
        <h4 className="form-title">Search Form</h4>
        <div className="form-center">
          <FormRow type="text" name="search" />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            list={Object.values(JOB_STATUS)}
            defaultValue={JOB_STATUS}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            list={Object.values(JOB_TYPE)}
            defaultValue={JOB_TYPE.FULL_TIME}
          />
          <FormRowSelect
            labelText="sort"
            name="sort"
            list={Object.values(JOB_TYPE)}
            defaultValue={JOB_TYPE.FULL_TIME}
          />
          <button
            type="submit"
            className="btn btn-block form-btn"
          >
            Reset Search values
          </button>
        </div>
      </Form>
    </Wrapper>
  )
}
export default SearchContainer
