const Button = ({
    children,
    onClick,
    variant = "primary",
    size = "md",
    icon,
    className = "",
    type = "button",
  }) => {
    const baseStyles =
      "font-medium rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
  
    const sizes = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant] || ''} ${sizes[size]} ${className}`}
      >
        <span className="flex items-center gap-2">
        {icon}
        {children}
        </span>
      </button>
    );
  };
  
  export default Button;
  