const Dropdown = ({ label, name, value, onChange, options, required }) => {
  return (
    <div className="mb-4 flex items-start">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mr-4 pt-2 w-32">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
