import { FormRow } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { redirect, useOutletContext } from 'react-router-dom';
import { useNavigation, Form } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  // リクエストにfileが含まれるから、FormからactionにformDataを送る際にencTypeをmultipartにしている。
  // この場合、Object.fromEntries()によりJSON形式に変換せずにformDataのままサーバーに送信する必要がある。
  // fileはbinary形式であり、jsonに変換するとこの点でエラーが生じる。よってformDataのまま送る。
  // サーバー側で Multerライブラリをインストールすることで、formData形式のデータをサーバー側で受け取ることができる。
  const file = formData.get('avatar');
  // formDataの中では、Form内の各inputに付けたnameがキーになっている。getの引数にはキーを指定すると値が得られる。
  if (file && file.size > 500000) {
    toast.error('Image size too large');
    // fileは未選択のケースもあり、undefined.sizeでエラーが生じることを防ぐためにfile &&としている。
    return null;
    // action内で処理が完結する際には必ず何かをreturnすること。
  }
  try {
    await customFetch.patch('/user/update-user', formData);
    // オブジェクト形式に変換後のdataではなく、formDataをそのまま送ることに注意。
    toast.success('profile updated successfully');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }
  return null;
};

const Profile = () => {
  const { user } = useOutletContext();
  const { name, lastName, email, location } = user;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Wrapper>
      <Form method="post" className="form" encType='multipart/form-data'>
        {/* formDataにfileが含まれる場合は、encTypeを変更する。
        これにより、jsonに変換せずにformDataのままサーバーに送信できる */}
        <h4 className="form-title">profile</h4>
        <div className="form-center">
          <div className="form-row">
            {/* imageは他のFormRowとは中身が異なるから、個別に定義する。 */}
            <label htmlFor="avatar" className="form-label">
              Select an image file (max 0.5 MB)
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="form-input"
              accept="image/*"
            />
          </div>
          <FormRow type="text" name="name" defaultValue={name} />
          <FormRow
            type="text"
            name="lastName"
            labelText="last name"
            defaultValue={lastName}
          />
          <FormRow type="email" name="email" defaultValue={email} />
          <FormRow type="text" name="location" defaultValue={location} />
          <button
            type="submit"
            className="btn btn-block form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'submitting...' : 'submit'}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};
export default Profile;
