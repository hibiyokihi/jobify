import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const loader = async ({ params }) => {
  // pathに /:id のようにparameterが含まれる場合、loaderが受け取る引数の中のparamsにidが格納されている。
  // componentの中で、const params = useParams()としても同じparamsが得られる。どちらも使用可能。
  try {
    const { data } = await customFetch.get(`/jobs/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect('../all-jobs');
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/jobs/${params.id}`, data);
    toast.success('Job edited successfully');
    return redirect('../all-jobs');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect('../all-jobs');
  }
};

const EditJob = () => {
  const { job } = useLoaderData();
  const { position, company, jobLocation, jobStatus, jobType } = job;

  return (
    <Wrapper>
      <Form method="post" className="form">
        {/* Formにはactionのparamがあるが、routerの中にactionを書いてるからここでは不要。 */}
        <h4 className="form-title">edit job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={position} />
          <FormRow type="text" name="company" defaultValue={company} />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={jobLocation}
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            list={Object.values(JOB_STATUS)}
            defaultValue={jobStatus}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            list={Object.values(JOB_TYPE)}
            defaultValue={jobType}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default EditJob;
