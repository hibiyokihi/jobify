import Wrapper from '../assets/wrappers/DashboardFormPage';
import { Form, useSubmit, Link } from 'react-router-dom';
import { FormRow, FormRowSelect, SubmitBtn } from '.';
import { JOB_STATUS, JOB_TYPE, JOB_SORT_BY } from '../../../utils/constants';
import { useAllJobsContext } from '../pages/AllJobs';

const SearchContainer = () => {
  const submit = useSubmit();
  // 通常、Formからデータをsubmitする際には<button>を作ってtype='submit'とする。
  // useSubmitを使うと、buttonを作らなくてもonChangeイベントからformをsubmitできる。
  // これにより、Search項目が変わると即座にデータのre-fetchが行われてフィルター結果に反映される。
  const { searchValues } = useAllJobsContext();
  const { search, jobStatus, jobType, sort } = searchValues;
  // FormのdefaultValueをハードコードした場合、ページをリフレッシュした際に表示がデフォルト値に戻ってしまう。
  // 一方でリフレッシュしてもurl(query)はそのままだから、検索結果の表示は変わらず、検索欄と表示データに差異が生じる。
  // そこで、query-paramsをContextに保存して、defaultValueを動的にすることでこのバグを回避する。

  const debounce = (onChange) => {
    // debounceは、SearchContainerのレンダー時にのみ実行され、関数Aを受け取って、関数Bをリターンする。
    // 関数Aとは(form)=>submit(form)、関数Bとは(e)=>...の関数を指す。
    // debounceは、SearchフォームのonChangeに関数Bをセットする。
    // onChangeが発生して関数Bが実行された際に、formを取得して、0.5秒待ってから関数Aが実行され、formがsubmitされる。
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      // e.currentTargetは、このFormRow(search)。
      // e.currentTarget.formは、このFormRowが含まれるForm全体。よってForm全体をsubmitする。
      clearTimeout(timeout);
      // 0.5秒待ってる間に次のonChangeが発生すると不具合が起きるから、onChangeが発生する度に前回のtimeoutをクリアして設定し直す。
      timeout = setTimeout(() => {
        onChange(form);
      }, 500);
    };
  };

  return (
    <Wrapper>
      <Form className="form">
        {/* method='post'ではないことに留意。methodのデフォルトはget。ここではFormでgetリクエストする。
        Formでgetリクエストを送ると、現在のpathに対してquery付きのgetリクエストを送る。
        Form内でnameに指定した項目がqueryとなり、urlにqueryのkey-valueが表示される。
        ちなみに、actionはFormからpostした際に呼び出されるもので、getの際には発動しない。 */}
        <h5 className="form-title">Search Form</h5>
        <div className="form-center">
          <FormRow
            type="search"
            // textとの違いは、searchにしておくと入力文字を✖️で消すことができる(ブラウザの仕様による)。
            name="search"
            defaultValue={search}
            onChange={debounce((form) => {
              submit(form);
            })}
            // debounceについては上記参照。初回レンダー時にonChangeに関数をセットするための関数。
            // onChange={(e) => {
            //   submit(e.currentTarget.form);
            // 上記のように書いても良いが、1文字毎にfetchが実行されるため負荷が大きい。
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            list={['all', ...Object.values(JOB_STATUS)]}
            // JOB_STATUSのvalueをArrayにして、それをArrayの中でスプレッドしてallと合わせる。
            defaultValue={jobStatus}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            list={['all', ...Object.values(JOB_TYPE)]}
            defaultValue={jobType}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            name="sort"
            list={Object.values(JOB_SORT_BY)}
            defaultValue={sort}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            {/* pathにqueryが付いた状態でこのリンクを押すと、query無しのall-jobsのpathに戻る。これでqueryがリセットされる。 */}
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};
export default SearchContainer;
