const Card = ({ title, value, icon, bgColor = "bg-white", textColor = "text-gray-800" }) => {
    return (
      <div className={`p-6 rounded shadow flex items-center justify-between ${bgColor} ${textColor}`}>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    );
  };
  
  export default Card;