import { createContext, useState, useEffect, useContext, useRef } from "react";
import { toast } from "react-toastify"; // Make sure it's installed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in ms
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Check if parsedUser exists and has a valid username
        if (!parsedUser?.username) {
          toast.warning("Session Expired. Logging out...");
          logout(); // Or redirect to login
          return;
        }
        setUser(parsedUser);
        startInactivityTimer(); // Start on load
      } catch (e) {
        toast.error("Corrupted session. Logging out...");
        logout();
      }
    } else {
      toast.warning("Session Expired. Logging out...");
      logout();
    }

    setupActivityListeners();

    return () => {
      removeActivityListeners();
      clearInactivityTimer();
    };
  }, []);

  const startInactivityTimer = () => {
    clearInactivityTimer();
    timeoutIdRef.current = setTimeout(() => {
      logout(true); // Force logout after inactivity
    }, INACTIVITY_LIMIT);
  };

  const clearInactivityTimer = () => {
    clearTimeout(timeoutIdRef.current);
  };

  const setupActivityListeners = () => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach((event) => window.addEventListener(event, startInactivityTimer));
  };

  const removeActivityListeners = () => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach((event) => window.removeEventListener(event, startInactivityTimer));
  };

  const login = (data) => {
    const { user, token } = data;
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user)); // Correct way to store user
    localStorage.setItem("authToken", token);
    startInactivityTimer(); // Reset on login
  };

  const logout = (dueToInactivity = false) => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    clearInactivityTimer();
    if (dueToInactivity) {
      toast.info("You have been logged out due to inactivity.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
