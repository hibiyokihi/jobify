const FormRow = ({ type, name, labelText, defaultValue, onChange }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="form-input"
        defaultValue={defaultValue || ''}
        onChange={onChange}
        required
      />
      {/* react-router-domはformData-Apiを使ってformの入力内容にアクセスするから、valueにuseStateを使う必要はない。
          ここでは入力内容のValidationはHTMLに頼っている。requiredによる空欄チェックはJSではなくHTMLの機能 */}
    </div>
  );
};
export default FormRow;
