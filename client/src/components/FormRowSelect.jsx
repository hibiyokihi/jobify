const FormRowSelect = ({ name, labelText, list, defaultValue = '' }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        className="form-select"
        defaultValue={defaultValue}
      >
        {list.map((itemValue) => (
          <option key={itemValue} value={itemValue}>
            {itemValue}
          </option>
        ))}
        {/* Objectはmapできないから、Object.valuesでvaluesのArrayを作ってからmapする */}
      </select>
    </div>
  );
};

export default FormRowSelect;