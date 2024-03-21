import { useNavigation } from 'react-router-dom';

const SubmitBtn = ({formBtn}) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
    // submittingは、route内でFormをsubmitしてactionが実行中の状態。
  // loadingは、次のrouteに遷移するためにエレメントをレンダー中の状態。

  return (
    <button
      type="submit"
      className={`btn btn-block ${formBtn && "form-btn"}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'submitting...' : 'submit'}
    </button>
  );
};
export default SubmitBtn;
