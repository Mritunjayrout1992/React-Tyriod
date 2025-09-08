const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  labelWidth = "w-32",
  multiline = false,
  multiple = false,
  accept = "",
  classStyle = "mb-3 flex items-start",
  inputWidth = "w-[500px]",
}) => {
  return (
    <div className={classStyle}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 mr-2 pt-2 ${labelWidth}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-[300px] border border-gray-300 rounded px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : type === "file" ? (
        <input
          id={name}
          name={name}
          type="file"
          onChange={onChange}
          required={required}
          multiple={multiple}
          accept={accept}
          className="w-[300px] border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`${inputWidth} border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      )
      }
    </div>
  );
};


export default Input;
