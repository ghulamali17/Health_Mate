import { createContext, useState, useContext } from "react";

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("pos-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  //login function
const login = (userData) => {
  localStorage.setItem("pos-user", JSON.stringify(userData)); 
  setUser(userData);
};


  // logout function
const logout = () => {
  localStorage.removeItem("pos-user");    
  localStorage.removeItem("pos-token");    
  setUser(null);
};


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
