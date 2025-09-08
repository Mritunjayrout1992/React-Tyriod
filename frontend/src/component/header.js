
import { useState } from "react";
import { useNavigate } from "react-router-dom";  
import {useAuth} from '../contexts/AuthContext.js';
const Header = () => {
    const { logout, user } = useAuth(); // Access login function cdfrom context
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate(); // React Router navigation hook
    const handleLogout = () => {
      logout();
      navigate("/login");
    }
    console.log(localStorage.getItem('user'))
    var x = localStorage.getItem('user');
    return (
      <header
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1400&q=80')", // clothing-themed background
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-black bg-opacity-50 h-full">
          <h1 className="text-3xl font-bold">👕 Tyriod Clothing</h1>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Welcome {user?.username}▾
            </button>
            {dropdownOpen && (
            <ul className="absolute right-0 mt-2 bg-white text-black shadow-md rounded w-40 z-10">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick = {() => handleLogout()}>
                Logout
              </li>
            </ul>
          )}
          </div>
        </div>
      </header>
  )
};
  
  export default Header;