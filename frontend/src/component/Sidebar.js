import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FaHome, FaShoppingCart, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", to: "/dashboard" },
    { icon: <FaShoppingCart />, label: "Catalogue", to: "/catalogue" },
    { icon: <FontAwesomeIcon icon={faUpload} />, label: "Upload", to: "/upload" }
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen bg-[#0c1e35] text-white transition-all duration-300 flex flex-col`}
    >
      {/* Toggle Button */}
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} p-4 border-b border-white/10`}>
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <FaBars />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? "justify-center" : "gap-4"} 
               p-2 rounded hover:bg-white/10 transition-all duration-200
               ${isActive ? "bg-white/20 font-semibold" : ""}`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
