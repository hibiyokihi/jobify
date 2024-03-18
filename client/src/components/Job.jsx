import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link, Form } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';

import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
// dateオブジェクトのフォーマットをカスタマイズするライブラリ。デフォルトは見にくい。

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  jobStatus,
}) => {
  const date = day(createdAt).format('MMM Do, YYYY');
  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        {/* stringの最初の１文字を表示する方法 */}
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${jobStatus}`}>{jobStatus}</div>
          {/* jobStatusは、pending, interview, declinedが入り、index.cssでスタイリングしてる */}
        </div>
        <footer className="actions">
          <Link to={`../edit-job/${_id}`} className="btn edit-btn">
            {/* dashboard/all-jobsの階層にいるから、dashboard/edit-jobに行くには一つ上る必要がある。 */}
            {/* 絶対パスで/dashboard/edit-jobと書いても良い。 */}
            Edit
          </Link>
          <Form method='post' action={`../delete-job/${_id}`}>
            {/* deleteにはelementが無く、all-jobsのpathにあるこのFormからdelete-jobのpathにあるactionに処理を託す。
            よって、Formにactionパラムを置き、actionのあるpathを指定する。 */}
            {/* methodはget又はpost。deleteの場合もpostにする。 */}
            <button type="submit" className="btn delete-btn">
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  );
};
export default Job;
